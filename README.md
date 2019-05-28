# DartCal

You can see the version without Watson on branch `AIless`. Instead of relying on Watson for date parsing, we rely entirely on the `chrono` library to "magically" parse events (which we already use to parse date/time information that Watson spits out).

If you run it though, you'll see that it is much less accurate than relying on Watson for datetime parsing, so this does demonstrate that Watson _does_ help!

You can see the calendar containing all events from Dartmouth's ListServ mailing list [here](https://calendar.google.com/calendar/embed?src=kec3475e1t313trf1fhtvbpe84%40group.calendar.google.com&ctz=America%2FNew_York).
