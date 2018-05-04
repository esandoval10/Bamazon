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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "manage"
        }
    ]).then(function(choice){
        switch(choice.manage){
            case "View Products for Sale" :
            readProducts();
            return;
            case "View Low Inventory" : 
            displayLow();
            return;
            case "Add to Inventory" : 
            replenishProduct();
            return;
            case "Add New Product" :
            addProduct(); 
            return;

        }

    });
}

function readProducts() {
    console.log("Loading all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      connection.end();
    });
  }

  function displayLow(){
    console.log("Loading low inventory...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
    
      for(var i = 0; i < res.length; i++){
       if (res[i].stock_quantity < 5){
           console.log(res[i]);
       }
    }
    });
  }
  function replenishProduct(){
      console.log("Accessing inventory update...\n");

      inquirer.prompt([
        {
            type: "input",
            message: "Enter the ID of the item you want to restock.",
            name: "stockId"
        },
        {
            type: "input",
            message: "Enter the number of items you want to order.",
            name: "orderAmount"
        }
    ]).then(function(choice){

        var id = choice.stockId;
        var amount = parseInt(choice.orderAmount);
        connection.query("select * from products", function(err, res){
            for(var i = 0; i < res.length; i++){
                if(res[i].item_id === id){
                    var itemAmount = res[i].stock_quantity;
                }
            };
            var orderAmount = itemAmount + amount;
            updateItems(orderAmount, id)
        });
    });
  }

function updateItems(newAmount, newId){
    console.log("Finishing Order....\n");
    var query = connection.query(
        "update products set ? where ?",
        [
            {
                stock_quantity : newAmount
            },
            {
                item_id : newId
            }
            
        ],
        function(err, res){
            console.log(res.affectedRows + " Items restocked");
        });
        // console.log(query.sql);
}

function addProduct(){
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the ID of the item you want to add.",
            name: "addId"
        },
        {
            type: "input",
            message: "Enter a name for the new item.",
            name: "addName"
        },
        {
            type: "input",
            message: "Enter a department for the new item.",
            name: "addDepartment"
        },
        {
            type: "input",
            message: "Enter the price of the new item.",
            name: "addPrice"
        },
        {
            type: "input",
            message: "Enter the stock available for the new item.",
            name: "addStock"
        },
    ]).then(function(choice){
        // var newModId = choice.addId,
        // newModName = choice.addName,
        // newModDepartment = choice.addDepartment,
        var newModPrice = parseFloat(choice.addPrice),
        newModStock = parseInt(choice.addStock);

        var addText = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES (" + choice.addId + ", '" + choice.addName + "', '" + choice.addDepartment + "', " + newModPrice + ", " + newModStock + ")"
        // console.log(addText);

        var query = connection.query(addText, function(err, res){
            if (err) throw err;
            console.log(query.sql);
            console.log("New Item now in stock!");

        });
    });
}