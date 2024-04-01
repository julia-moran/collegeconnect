import csv

# Open the CSV file and read its content
with open('classes.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file)
    classes = list(csv_reader)

# Open the SQL file and write the INSERT statements
with open('classes.sql', 'w') as sql_file:
    sql_file.write("INSERT INTO chatRoom(classcode,classname,classroom,classprof)\nVALUES\n")

    for i, class_info in enumerate(classes):
        class_code = class_info[0] + str(class_info[1])
        class_name = class_info[2]
        classroom = 'Old Main 158'  # Default value
        classprof = 'John Doe'  # Default value

        sql_file.write(f"('{class_code}','{class_name}','{classroom}', '{classprof}')")

        # If this is not the last class, add a comma and a newline
        if i != len(classes) - 1:
            sql_file.write(",\n")
        else:  # If this is the last class, add a semicolon
            sql_file.write(";\n")