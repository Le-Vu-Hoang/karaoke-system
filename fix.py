import re
path = 'backend/src/modules/invoice/invoice.service.ts'
with open(path, 'r') as f:
    text = f.read()

text = text.replace("""        booking: {
          include: {
            deposit: true,
          },
        },""", "        booking: true,")

with open(path, 'w') as f:
    f.write(text)
