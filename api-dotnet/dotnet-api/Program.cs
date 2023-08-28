using dotnet_api.DB;
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();


app.MapGet("/getCustomer/{id}",(int id) =>  {
    Customer ?  customer = CustomerDB.GetCustomerById(id);
    return   customer == null ? Results.NotFound("there is not customer with the id " + id) : Results.Ok(customer);
});

  
app.MapGet("/getAllCustomers", () => CustomerDB.GetAllCustomers());

app.MapPost("/createNewCustomer", (Customer customer) => {
    if(customer.Name == null){
        return  Results.BadRequest("no name in customer");
    }
    int ? id = CustomerDB.CreateCustomer(customer);
 
    return id == null ? Results.Problem("problem in db try again") : Results.Ok(id) ;

});
app.MapPut("/updateCustomer", (Customer customer) =>
{
    if(customer.Name == null || customer.Id == null ){
        return  Results.BadRequest("no name or id in customer");
    }
    int ? id =  CustomerDB.UpdateCustomer(customer);
    
 
    return id == null ? Results.NotFound("id is not in the data base") : Results.Ok(id);

});
app.MapDelete("/deleteCustomer/{id}", (int id) => CustomerDB.RemoveCustomer(id));



app.Run();
