with open(r"c:\Users\Admin\OneDrive - VNPT\AI\Webapp\app.js", "r", encoding="utf-8") as f:
    content = f.read()

stack = []
mapping = {')': '(', '}': '{', ']': '['}
lines = content.split('\n')

for i, line in enumerate(lines, 1):
    for char in line:
        if char in '({[':
            stack.append((char, i))
        elif char in ')}]':
            if not stack:
                print(f"Unmatched closing char '{char}' at line {i}")
            else:
                top, top_line = stack.pop()
                if top != mapping[char]:
                    print(f"Mismatch: '{top}' opened at line {top_line} but closed with '{char}' at line {i}")

if stack:
    print("Unclosed structures:")
    for char, line in stack:
        print(f"Char '{char}' opened at line {line} was never closed")
else:
    print("Brackets are balanced! No basic syntax error in terms of brackets.")
