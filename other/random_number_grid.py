import random

grid_height = 50
grid_width = 50

for i in range(grid_height):
    for j in range(grid_width):
        print(random.randint(0, 9), end='')
    print()
