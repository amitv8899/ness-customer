namespace dotnet_api.DB; 


 public record Customer 
 {

   public int   ?  Id {get; set;} 
   public string  Name { get; set; }
   public string ? Address { get; set; }
   public string ? Contact { get; set; }
   public string ? PhoneNumber { get; set; }
   public string ? Type { get; set; }
 }

 public class CustomerDB
 {
   private static int  DbCounter = 4;
   private static List<Customer> _customers = new List<Customer>()
   {
      new Customer{Id = 1, Name = "amit", Address = "addressCustomer1", Contact = "amit", PhoneNumber = "0545671922",Type = "internal" },
      new Customer{Id = 2, Name = "adi", Address =  "addressCustomer2", Contact = "amit", PhoneNumber = "0525621954",Type = "internal" },
      new Customer{Id = 3, Name = "omer", Address = "addressCustomer3", Contact = "adi", PhoneNumber = "0525171820",Type = "internal" }
     
};

   public static List<Customer> GetAllCustomers() 
   {
     return _customers;
   } 

   public static Customer ? GetCustomerById(int id) 
   {
     return _customers.SingleOrDefault(customer => customer.Id == id);
   } 

   public static int ? CreateCustomer(Customer newCustomer) 
   {
     Customer insert = newCustomer;
     insert.Id = DbCounter ;
     _customers.Add(insert);
      DbCounter ++  ;
     return insert.Id;
   }

   public static int ? UpdateCustomer(Customer update) 
   {
      int ? id = null;
    
     _customers = _customers.Select(customer =>
     {
       if (customer.Id == update.Id)
       {
         id = update.Id;
         customer.Name = update.Name;
         customer.Address = update.Address;
         customer.Contact = update.Contact;
         customer.PhoneNumber = update.PhoneNumber ;
         customer.Type = update.Type;
       }
       return customer;
     }).ToList();

     return id;
   }

   public static void RemoveCustomer(int id)
   {
     _customers = _customers.FindAll(customer => customer.Id != id).ToList();
   }
 }