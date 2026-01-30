# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - banner [ref=e7]:
      - generic [ref=e9]:
        - generic [ref=e10]:
          - img [ref=e12]
          - generic [ref=e15]:
            - heading "AI Todo Assistant" [level=1] [ref=e16]
            - paragraph [ref=e17]: Manage tasks with natural language
        - button "Start new conversation" [ref=e18] [cursor=pointer]:
          - img [ref=e19]
          - generic [ref=e21]: New Chat
    - generic [ref=e23]:
      - img [ref=e25]
      - heading "Start a conversation" [level=2] [ref=e27]
      - paragraph [ref=e28]: "I'm your AI todo assistant. Try asking me to:"
      - generic [ref=e29]:
        - generic [ref=e30]: "\"Add buy groceries to my list\""
        - generic [ref=e31]: "\"Show my pending tasks\""
        - generic [ref=e32]: "\"Mark task 3 as complete\""
        - generic [ref=e33]: "\"Update my meeting task\""
    - generic [ref=e36]:
      - generic [ref=e37]:
        - textbox "Message input" [ref=e39]:
          - /placeholder: Type a message... (e.g., 'Add buy groceries')
        - button "Send message" [disabled] [ref=e40]:
          - img [ref=e41]
      - generic [ref=e44]: Press Enter to send, Shift+Enter for new line
  - region "Notifications alt+T"
  - alert [ref=e45]
```