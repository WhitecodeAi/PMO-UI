import re

with open('src/data.js', 'r') as f:
    content = f.read()

# Replace p1..p14
for i in range(1, 15):
    old_key = f'"p{i}"'
    new_key = f'"WC{i:03d}"'
    content = content.replace(old_key, new_key)

# Replace REQ-001..REQ-009
for i in range(1, 10):
    old_req = f'"REQ-{i:03d}"'
    new_req = f'"WC{10+i:03d}"'
    content = content.replace(old_req, new_req)

with open('src/data.js', 'w') as f:
    f.write(content)
