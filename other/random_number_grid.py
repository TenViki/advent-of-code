import random

grid_height = 45
grid_width = 45

for i in range(grid_height):
    for j in range(grid_width):
        print(random.randint(0, 9), end='')
    print()
