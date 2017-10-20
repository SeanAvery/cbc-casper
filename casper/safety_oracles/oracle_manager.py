from casper.safety_oracles.clique_oracle import CliqueOracle
from casper.safety_oracles.turan_oracle import TuranOracle
from casper.safety_oracles.adversary_oracle import AdversaryOracle

import casper.utils as utils

class OracleManager:

    def __init__(self, view, validator_set, safety_threshold):
        self.validator_set = validator_set
        self.view = view
        self.safety_threshold = safety_threshold
        self.viewables_for_estimate = dict()
        self.last_checked_messages = dict()


    def update_viewables(self):
        # for each estimate we are keeping track of
        for estimate in self.viewables_for_estimate:
            # get the newest messages that are conflicting with it from each validator (there may be None)
            newest_conflicting_messages = self.get_newest_conflicting_messages(estimate)
            # for each of these newly conflicting messages
            for new_conflicting_message in newest_conflicting_messages:
                # try to make it a viewable for each validator
                for validator in self.validator_set:
                    # can't be a viewable for a validator who created
                    if new_conflicting_message.sender == validator:
                        continue
                    # can only be a viewable if a validator has not seen it!
                    if not self.validator_has_seen_message(validator, new_conflicting_message):

                        self.viewables_for_estimate[estimate][validator][new_conflicting_message.sender] = new_conflicting_message

        # now, delete old viewables that are oudated, for each estimate
        for estimate in self.viewables_for_estimate:
            # for each validator we have seen a message from (only way to see viewables!)
            for validator in self.view.latest_messages:
                # keep track of outdated viewables (can't remove mid-iteration)
                to_remove = set()
                # for each of these viewables
                for v in self.viewables_for_estimate[estimate][validator]:
                    viewable = self.viewables_for_estimate[estimate][validator][v]
                    if viewable:
                        # if the validator has seen the viewable, then we can remove it
                        if self.validator_has_seen_message(validator, viewable):
                            assert viewable in validator.view.messages # just for testing
                            to_remove.add(v)

                # remove all the outdated viewables
                for v in to_remove:
                    del self.viewables_for_estimate[estimate][validator][v]

        for estimate in self.viewables_for_estimate:
            for v in self.view.latest_messages:
                self.last_checked_messages[estimate][v] = self.view.latest_messages[v]


    def validator_has_seen_message(self, validator, message):

        if validator not in self.view.latest_messages:
            return False

        if message.sender not in self.view.latest_messages[validator].justification.latest_messages:
            return False

        latest_seen_message = self.view.latest_messages[validator].justification.latest_messages[message.sender]

        if message.sequence_number > latest_seen_message.sequence_number:
            return False

        # just for testing, not actually allowed in the real world :)
        assert message in validator.view.messages, "...should have seen message!"
        return True


    def get_newest_conflicting_messages(self, estimate):
        # dict from validator (not all) => newest conflicting message with estimate
        # NOTE: we can only consider the most recent message as all oracles are assumed to be side effects free
        newest_conflicting_messages = set()

        # for each validator we have seen messages from
        for validator in self.view.latest_messages:

            # if we previous checked some of their messages
            if validator in self.last_checked_messages[estimate]:
                # then the last_checked_sequence_num is the message we checked
                last_checked_sequence_num = self.last_checked_messages[estimate][validator].sequence_number
            else:
                # otherwise, we've never checked something from them before
                # TODO: low hanging fruid for optimization here:
                # set the last_checked_sequence_num to be the oldest message from this validator
                # in the justification of the latest messages from all validators
                last_checked_sequence_num = -1

            # start at their most recent message, and go to the last message we checked
            tip = self.view.latest_messages[validator]
            while tip and tip.sequence_number > last_checked_sequence_num:
                # if the message conflicts, stop looking!
                if utils.are_conflicting_estimates(estimate, tip):
                    newest_conflicting_messages.add(tip)
                    break
                if validator not in tip.justification.latest_messages:
                    break
                tip = tip.justification.latest_messages[validator]

        return newest_conflicting_messages



    def _remove_outdated_estimates(self, finalized_estimate):
        # no longer need to keep track of estimates that are a) safe, or b) def not safe
        to_remove = set()

        for estimate in self.viewables_for_estimate:
            if utils.are_conflicting_estimates(finalized_estimate, estimate):
                to_remove.add(estimate)

        for estimate in to_remove:
            del self.last_checked_messages[estimate]
            del self.viewables_for_estimate[estimate]

        del self.viewables_for_estimate[finalized_estimate]


    def check_safety(self, estimate):
        if estimate not in self.viewables_for_estimate:
            # we store them as None to represent that the validator has a viewable in that they have not seen
            # anything from this other validator
            self.last_checked_messages[estimate] = dict()
            self.viewables_for_estimate[estimate] = {v: dict() for v in self.validator_set}

        self.update_viewables()

        oracle = CliqueOracle(estimate, self.view, self.validator_set, self.viewables_for_estimate[estimate])
        fault_tolerance, _ = oracle.check_estimate_safety()

        if fault_tolerance > self.safety_threshold:
            self._remove_outdated_estimates(estimate)
            return True
        else:
            return False
