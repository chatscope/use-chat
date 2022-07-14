# Use Chat

[![Actions Status](https://github.com/chatscope/chat-ui-kit-react/workflows/build/badge.svg)](https://github.com/chatscope/use-chat/actions) [![npm version](https://img.shields.io/npm/v/@chatscope/use-chat.svg?style=flat)](https://npmjs.com/@chatscope/use-chat) [![](https://img.shields.io/npm/l/@chatscope/use-chat?dummy=unused)](https://github.com/chatscope/use-chat/blob/main/LICENSE) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

React hook for state management in chat applications.

Full documentation is not available yet, but **will be prepared**.

If you are interested in this library and need more documentation,
please let me know by adding one of the positive reactions (+1, Heart, Rocket) in the dedicated issue here:  [https://github.com/chatscope/use-chat/issues/1](https://github.com/chatscope/use-chat/issues/1)

## What is it?

This is a headless chat library. Think of it as something like a Formik but for chat apps.

The library can be used both with [@chatscope/chat-ui-kit-react](https://github.com/chatscope/chat-ui-kit-react) as well as with other chat components. 

The goal of it is to provide a tool for handling features that are most often implemented in chat applications.  
Primarily it's an application state management as well as some nice addons such as debounce or throttling of sending or receiving typing indicator signaling.

## Why?

The logic of chat applications is often repetitive. Most of these applications contains a user list, a conference list and of course messages.
There are at least a few chat API providers on the market. They provide saas services that you can use to build a chat application.
You also almost always get a ready-to-use, simple messaging library from them. Such a library encapsulates a complex communication protocol.  
Sometimes you also get UI components and hooks/providers that bind the UI to the provider's messaging library.
Both are closely related, which makes replacing the messaging library or UI components a lot of work. 

In this case you have to take care of how to keep in your app: a list of contacts and theirs statuses, a list of messages for each contact, switching between chats, setting an active chat, rendering messages and so on...   

If you create your own backed and implement the communication layer yourself, you will also not avoid doing all these things.

Isn't it better to focus on the business functionality of the application? On the layout, colour selection etc., instead of wondering how to find a message in the array to set its state to "read"?

Such things often turn out to be more complicated to do than they seem.

For example, a message list is not always a flat array.
It will often be an object with messages assigned to users and conversations, and additionally, it will be grouped into blocks of incoming and outgoing messages. 

Adding a message to the list requires roughly the following steps:
- find a message list for a given conversation,
- find the last group,
- check if this is the group of the user the message comes from,
- if it's not, then create a group and add the message to it
- add the group to the list

Uff, there is a bit of it, right?

Such things should be closed in separate logic libraries, which can be used in a simple and intuitive way.
The implementation of a consistent interface also provides the possibility of internal tuning (e.g. changing the data structure) without changing the way the library is used.

## Features

- handling users states (with user business properties such as name, avatar, presence etc.)
- handling conversations state (including current conversation)
- handling grouped messages state for many conversations
- sending debounced typing indicator
- auto throttling received typing indicator
- handling current message input value
- handling message drafts
- updating existed messages
- support for any communication service

## Installation

Using yarn.

```sh
yarn install @chatscope/use-chat
```

Using npm.

```sh
npm install @chatscope/use-chat
```

## Architecture

The library consist of three parts:

- storage - the place where the state is kept
- ChatProvider - chat context provider
- useChat - hook that binds storage service and UI

### BasicStorage

This is a class that implements the IStorage interface. 
All data such as conversations, messages, current conversation indicator etc sits in the storage. 
BasicStorage is the basic implementation of the IStorage. It should be fully functional, and can be used for most applications.
However, it is possible to write new implementations e.g. based on redux or another state library.
That is why the storage is provided to ChatProvider from the outside. 

### ExampleChatService

This is a class that implements IChatService interface.
The purpose of this service is to maintain a connection with the chat server, send and receive messages and chat protocol commands.
This is a point that connects your chat server with the library.
To use this library, you need to write your own ChatService that implements the IChatService interface.
The implementation of the service depends on which chat server you are using.
The content of the service can be your code written from scratch, but the service also can be an encapsulation layer for any ready to use chat communication library   
There is [src/examples/ExampleChatService.ts](https://github.com/chatscope/use-chat/blob/main/src/examples/ExampleChatService.ts) available for a quick start. This is a good starting point for developing the real service for your application.

At the future I will provide more examples showing real communication with socket.io based chat server.  

Service implementations for some SAAS providers will also be available. 

### Service factory

It is a simple function that you need to implement yourself.
This function receives a chat storage object (IChatStorage) as the first argument and update function as the second.
This function must return an instance of the class implementing IChatService.
Sometimes in your ChatService implementation, you will need to get values from the storage as well as save them to the storage.
Here you can pass the storage to your service. Access to the storage state is provided by storage.getState() method.
Writing to the storage is realized by calling functions such as storage.addConversation(), storage.addUser() etc.
The second argument is the **updateState** function.
Each write to the storage performed from the service needs to call the updateState function to perform re-render.
For example when the service receives signalization that some user has connected, you can add user to storage using storage.addUser() method
and next call updateState(). 

This description probably looks complicated :). But believe, me it's really simple compared to when you have to take care of everything.

## Basic usage

This is very simple example, but it shows how easy is it to implement a chat using **useChat** hook.

For more complex example based on CRA please visit [https://github.com/chatscope/use-chat-example](https://github.com/chatscope/use-chat-example).
Working example app is available here: [https://use-chat.examples.chatscope.io](https://use-chat.examples.chatscope.io)  

File: index.js

```jsx
import {nanoid} from "nanoid";
import {
  BasicStorage,
  ChatProvider,
  ExampleChatService,
  AutoDraft
} from "@chatscope/use-chat";

// Storage needs to generate id for messages and groups
const messageIdGenerator = () => nanoid();
const groupIdGenerator = () => nanoid();

// Create serviceFactory
const serviceFactory = (storage, updateState) => {
  return new ExampleChatService(storage, updateState);
};

const chatStorage = new BasicStorage({groupIdGenerator, messageIdGenerator});

export const App = () => {
  return (
    <ChatProvider serviceFactory={serviceFactory} storage={chatStorage} config={{
      typingThrottleTime: 250,
      typingDebounceTime: 900,
      debounceTyping: true,
      autoDraft: AutoDraft.Save | AutoDraft.Restore
    }}>
      <Chat />
    </ChatProvider>
  );
};
```

File Chat.js:

```jsx
import {useState, useMemo } from "react";
import { MainContainer, Sidebar, ConversationList, Conversation, Avatar, MessageGroup, Message,
  ChatContainer, ConversationHeader, MessageList, MessageInput} from "@chatscope/chat-ui-kit-react";
import { useChat, ChatMessage, MessageContentType, MessageDirection, MessageStatus } from "@chatscope/use-chat";

export const Chat = () => {

  // Message input value
  const [value, setValue] = useState("");

  // Get all chat related values and methods from useChat hook 
  const {
    currentMessages, conversations, activeConversation, setActiveConversation, sendMessage, getUser
  } = useChat();

  // Get current user data
  const [currentUserAvatar, currentUserName] = useMemo(() => {

    if (activeConversation) {
      const participant = activeConversation.participants.length > 0 ? activeConversation.participants[0] : undefined;

      if (participant) {
        const user = getUser(participant.id);
        if (user) {
          return [<Avatar src={user.avatar} />, user.username]
        }
      }
    }

    return [undefined, undefined];

  }, [activeConversation]);

  const handleSend = text => {

    // Logger user (sender)
    const currentUserId = "123";

    const message = new ChatMessage({
      id: "",
      content: text,
      contentType: MessageContentType.TextHtml,
      senderId: currentUserId,
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent
    });

    sendMessage({
      message,
      conversationId: activeConversation.id,
      senderId: currentUserId,
    });

  };

  return (<MainContainer>
    <Sidebar position="left">
      <ConversationList>
        {conversations.map(c => {
          
          // Helper for getting the data of the first participant
          const [avatar, name] = (() => {

            const participant = c.participants.length > 0 ? c.participants[0] : undefined;
            if (participant) {
              const user = getUser(participant.id);
              if (user) {

                return [<Avatar src={user.avatar} />, user.username]

              }
            }

            return [undefined, undefined]
          })();

          return (<Conversation key={c.id}
                        name={name}
                        active={activeConversation?.id === c.id}
                        unreadCnt={c.unreadCounter}
                        onClick={e => setActiveConversation(c.id)}>
            {avatar}
          </Conversation>);
        })}
      </ConversationList>
    </Sidebar>
    
    <ChatContainer>
      
      <ConversationHeader>
        {currentUserAvatar}
        <ConversationHeader.Content userName={currentUserName} />
      </ConversationHeader>
      
      <MessageList>
        {currentMessages.map(g => <MessageGroup key={g.id} direction={g.direction}>
          <MessageGroup.Messages>
            {g.messages.map(m => <Message key={m.id} model={{
              type: "text",
              payload: m.content
            }} />)}
          </MessageGroup.Messages>
        </MessageGroup>)}
      </MessageList>
      
      <MessageInput value={value} onSend={handleSend} />
      
    </ChatContainer>
    
  </MainContainer>);
}
```

## Community and support

* Twitting via [@chatscope](https://twitter.com/chatscope)
* Chatting at [Discord](https://discord.gg/TkUYWQRf2M)
* Facebooking at [Facebook](https://www.facebook.com/chatscope)
* Articles on the [chatscope blog](https://chatscope.io/blog/)

## Website

[https://chatscope.io](https://chatscope.io)

## License

[MIT](https://github.com/chatscope/use-chat/blob/main/LICENSE)
