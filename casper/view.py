"""The view module ... """
from casper.justification import Justification
import casper.forkchoice as forkchoice


class View:
    """A set of seen messages. For performance, also stores a dict of most recent messages."""
    def __init__(self, messages=set()):

        # now for some assignment...
        self.messages = set()
        self.latest_messages = dict()
        self.children = dict()
        self.last_finalized_block = None

        self.add_messages(messages)

    def __str__(self):
        output = "View: \n"
        for bet in self.messages:
            output += str(bet) + "\n"
        return output

    def estimate(self):
        """The estimate function returns the set of max weight estimates
        This may not be a single-element set because the validator may have an empty view."""
        return forkchoice.get_fork_choice(
            self.last_finalized_block,
            self.children,
            self.latest_messages
        )

    def justification(self):
        """Returns the latest messages seen from other validators, to justify estimate."""
        return Justification(self.last_finalized_block, self.latest_messages)

    def add_messages(self, showed_messages):
        """This method updates a validator's observed latest messages
        (and vicarious latest messages) in response to seeing new messages."""

        if not showed_messages:
            return

        #### PART -1 - type check

#        for b in showed_messages:
#            assert isinstance(b, Block), "expected only to add messages"

        #### PART 0 - finding newly discovered messages

        newly_discovered_messages = self.get_new_messages(showed_messages)

        #### PART 1 - updating the set of viewed messages

        self.messages.update(newly_discovered_messages)

        #### PART 2 - updating latest messages

        # Updating latest messages...
        for bet in newly_discovered_messages:
            if bet.sender not in self.latest_messages:
                self.latest_messages[bet.sender] = bet
                continue
            if self.latest_messages[bet.sender].sequence_number < bet.sequence_number:
                self.latest_messages[bet.sender] = bet
                continue
#            assert (bet == self.latest_messages[bet.sender] or
#                    bet.is_dependency_from_same_validator(self.latest_messages[bet.sender])),
#                   "did not expect any equivocating nodes!"

        #### PART 3 - updating children

        for bet in newly_discovered_messages:
            if bet.estimate not in self.children:
                self.children[bet.estimate] = set()
            self.children[bet.estimate].add(bet)

    def get_new_messages(self, showed_messages):
        """This method returns the set of messages out of showed_messages
        and their dependency that isn't part of the view."""

        new_messages = set()
        # The memo will keep track of messages we've already looked at, so we don't redo work.
        memo = set()

        # At the start, our working set will be the "showed messages" parameter.
        current_set = set(showed_messages)
        while current_set != set():

            next_set = set()
            # If there's no message in the current working set.
            for message in current_set:

                # Which we haven't seen it in the view or during this loop.
                if message not in self.messages and message not in memo:

                    # But if we do have a new message, then we add it to our pile..
                    new_messages.add(message)

                    # and add the bet in its justification to our next working set
                    for bet in message.justification.latest_messages.values():
                        next_set.add(bet)
                    # Keeping a record of very message we inspect, being sure not
                    # to do any extra (exponential complexity) work.
                    memo.add(message)

            current_set = next_set

        # After the loop is done, we return a set of new messages.
        return new_messages
