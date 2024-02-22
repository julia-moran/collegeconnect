import csv

with open('formResponsesFormatted.tsv', 'r') as tsvfile, open('userInfo.sql', 'w') as sqlfile:
    lines = tsvfile.readlines()

    sqlfile.write("INSERT INTO userInfo (displayName, email, clearance, firstName, lastName) VALUES\n")

    for line in lines:
        line = line.strip().split(' ')
        email = line[-1]
        name_parts = line[:-1]
        firstName = name_parts[0]
        if len(name_parts) == 2:
            lastName = name_parts[1]
        elif len(name_parts) == 3:
            lastName = name_parts[1] + ' ' + name_parts[2]
        else:
            lastName = ''
        displayName = firstName + ' ' + lastName
        clearance = "'1'"
        sqlfile.write(f"('{displayName}', '{email}', {clearance}, '{firstName}', '{lastName}'),\n")

    sqlfile.seek(sqlfile.tell() - 2, 0)
    sqlfile.write(";")