# Sky-chat ![](http://sky-api.whitechapeau.com/images/sky-1.png)

This is a simple chat server.

Get all the messages for a channel or create a channel

```sh
GET http://sky-chat.whitechapeau.com/:channel
```

Connect to a channel's message feed over a websocket like this:

```sh
ws://sky-chat.whitechapeau.com/:channel/:displayname
```

`:channel` is the tv channel chat you want to follow `:displayname` is your display name.

Listen for messages. When they arrive they will be in the following format:

`displayname|timestamp|message`

It is structured like this so you can split it and assign like so:

```js
const [name, ts, msg] = message.split('|')
```

`ts` is in from the javascript `new Date().getTime()` so it includes milliseconds plus the unix timestamp. Parse it how you like.

You can empty the datastore like this:

```sh
DELETE http://sky-chat.whitechapeau.com/
```

You can remove an offending message like this:

```sh
DELETE http://sky-chat.whitechapeau.com/:key
```

No authentication so be careful, this is a play thing.
Have fun times **media stacking** (watching and messaging)
