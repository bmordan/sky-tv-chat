# Sky-chat

This is a simple chat server.

Get all the messages for a channel or create a channel

```
GET http://sky-chat.whitechapeau.com/:channel
```

Connect to a channels message feed over a websocket like this...

```
ws://sky-chat.whitechapeau.com/:channel/:displayname
```

`:channel` is the tv channel whos chat you want to follow `:displayname` is your display name and will be displayed next to your messages.

Listen for messages when they arrive the will be in the following format:

`displayname|timestamp|message`

Its structured like this so you can split it an assign like this:

```js
const [name, ts, msg] = message
```

`ts` is in from the javascript `new Date().getTime()` so it includes milliseconds plus the unix timestamp. Parse it how you like.

No authentication so be careful.

You can empty the datastore like this:

```
DELETE http://sky-chat.whitechapeau.com/
```

You can remove an offending message like this:

```
DELETE http://sky-chat.whitechapeau.com/:key
```

Have fun times **media stacking** (watching and messaging)
