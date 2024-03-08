import java.sql.*; 
class MysqlCon{
    public static void main(String args[]) {
        try{
            Connection dbCxn=DriverManager.getConnection(
                "jdbc:mysql://localhost:53306/WhatAndWho","root","lucky_badger"
            );
    
            Statement selectFromWho=dbCxn.createStatement();
            ResultSet rsWho=selectFromWho.executeQuery("select * from Who");
        
            while(rsWho.next()) {
                int foreignKeyToWhat = rsWho.getInt(4); 
                System.out.println(rsWho.getInt(1)
                    + "  " + rsWho.getString(2)
                    + "  " + rsWho.getString(3) 
                    + "  " + rsWho.getInt(4));
                String whatQuery = "select * from What where What_pk = '" + foreignKeyToWhat + "'"; 
                System.out.println(whatQuery);

                Statement selectFromWhat=dbCxn.createStatement(); 
                ResultSet rsWhat=selectFromWhat.executeQuery (whatQuery);

                while(rsWhat.next()) {
                    System.out.println(rsWhat.getInt(1)
                        + "  " + rsWhat.getString(2)
                        + "  " + rsWhat.getInt(3)
                        + "  " + rsWhat.getDate(4)
                        + "  " +rsWhat.getString(5)
                    );
                }
                
            }
            dbCxn.close();
        } catch (Exception e) { System.out.println(e); }
    }
}
