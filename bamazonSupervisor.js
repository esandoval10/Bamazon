// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
// MySQL Database Connection
var connection = mysql.createConnection({
   host: "localhost",
   port: 3306,
   user: "root",
   password: "",
   database: "bamazon"
});
// Initiate MySQL Connection
connection.connect(function(err) {
    if(err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("Connected as id " + connection.threadId);
    start();
});

function start(){

    inquirer.prompt([
        {
            type: "list", 
            message: "Bamazon Management", 
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "supervise"
        }
    ]).then(function(choice){
        switch(choice.supervise){
            case "View Product Sales by Department" :
            showSales();
            return;
            case "Create New Department" : 
            newDepartment();
            return;
        }
    });
}

function showSales(){
    connection.query("select * from departments", function(err, res){
        for(var i = 0; i < res.length; i++){
            console.log(res[i].department_id + " | " + res[i].department_name + " | " + res[i].over_head_costs + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------------");
    });
}


function  newDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the name of the department you want to add.",
            name: "addName"
        },
        {
            type: "input",
            message: "Enter initial over head cost of the new department.",
            name: "addCost"
        },
    ]).then(function(choice){
        var newCost = parseFloat(choice.addCost);

        var addText = "INSERT INTO departments (department_name, over_head_costs) VALUES (" + "'" + choice.addName + "', " + newCost + ")"
        console.log(addText);

        var query = connection.query(addText, function(err, res){
            if (err) throw err;
            console.log(query.sql);
            console.log("New department ready for orders!");

        });
    });
}