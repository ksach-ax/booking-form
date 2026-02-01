uniq = []

with open('./cars.txt') as f:
    for line in f:
        if line.strip() not in uniq:
            uniq.append(line.strip()) 

with open('./out.txt', 'a') as o:
    for entry in uniq:
        o.write(entry + '\n')
