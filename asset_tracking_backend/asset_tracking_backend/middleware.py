from datetime import timedelta
import logging
import time
from users.models import ActivityLog
logger = logging.getLogger("user_activity")


class LogUserVisits(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        """
        Log the different pages visited by user.
        """
        start = time.time_ns()
        response = self.get_response(request)

        path = request.path
        ignore = ["uploads", "static", "admin", "media"]
        if not any(x in path.split("/") for x in ignore):

            username = request.user.username if request.user.is_authenticated else "Anonymous"
            action = "%s %s" % (request.method, path)

            end = time.time_ns()
            duration_in_mills = (end - start) // 1_000_000

            ActivityLog.objects.create(username=username,
                                        action=action,
                                        duration_in_mills=duration_in_mills)
        return response

