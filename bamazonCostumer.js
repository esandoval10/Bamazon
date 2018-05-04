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
    displayItems();
});
// Displays Items Available to user 
function displayItems(){
    connection.query("select * from products", function(err, res){
        for(var i = 0; i < res.length; i++){
            console.log("ID: " + res[i].item_id + " | " + " Item: " + res[i].product_name + " | " + " Price: $" + res[i].price + " |\n");
        }
        console.log("-----------------------------------------\n");
        start();

    });
}
// Asks the Questions
function start(){

    inquirer.prompt([
        {
            type: "input",
            message: "Enter the ID of the item you want to purchase.",
            name: "itemId"
        },
        {
            type: "input",
            message: "Enter the number of items you want to purchase.",
            name: "amountBuy"
        }
    ]).then(function(choice){

        var getId = choice.itemId;
        var getAmount = parseInt(choice.amountBuy);
        var itemAmount,
        itemPrice,
        department;
        connection.query("select * from products", function(err, res){
            for(var i = 0; i < res.length; i++){
                if(res[i].item_id === getId){
                    itemAmount = res[i].stock_quantity;
                    itemPrice = res[i].price;
                    department = res[i].department_name;
                    console.log(itemAmount + " " + itemPrice);
                }
            };
            if(getAmount < itemAmount){
                console.log("Loading Transaction...\n")
                var bought = itemAmount - getAmount;
                var cost =  itemPrice * getAmount;
                updateItems(bought, getId, cost);
                returnProfit(cost, department);
            }
            else if (getAmount > itemAmount){
                console.log("Insufficient Quantity!\n")
                connection.end();
            }
        });
    });
}

function updateItems(newAmount, boughtId, price){
    console.log("Finishing Order....\n");
    var query = connection.query(
        "update products set ? where ?",
        [
            {
                stock_quantity : newAmount
            },
            {
                item_id : boughtId
            }
            
        ],
        function(err, res){
            console.log(res.affectedRows + " Purchase complete your total is " + price);
        });
        // console.log(query.sql);
}

function returnProfit(sales, departmentName){

    var overhead;

    var query = connection.query("select * from departments", function(err, res){
        for(var i = 0; i < res.length; i++){
            if(res[i].department_name === departmentName){
                overhead = res[i].over_head_costs;
                var profit = sales - overhead;updateSupervisor(departmentName, sales, profit);
            }
        };
    });
    // console.log(profit);
}
function updateSupervisor(departmentName, finalSales, finalProfit){
    var addText = "update departments set ? where ?";
    console.log(departmentName, finalSales, finalProfit);

    var query = connection.query(addText,
        [
        {
            product_sales : finalSales,
            total_profit : finalProfit
        },
        {
            department_name : departmentName
        }
        
    ],
    function(err, res){
        if (err) throw err;
    });

}