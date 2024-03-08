import java.sql.*;
class WhatJDBC {
    public static void main(String[] args) {
        try {
            Connection dbCxn=DriverManager.getConnection(
                    "jdbc:mysql://localhost:53336/WhatAndWho","root","lucky_badger"
            );
            Statement selectFromWhat=dbCxn.createStatement();
            ResultSet rsWhat=selectFromWhat.executeQuery("select * from What");
            while (rsWhat.next()) {
                System.out.println(
                        rsWhat.getInt(1)
                        + "  " + rsWhat.getString(2)
                                + "  " + rsWhat.getString(3)
                                + "  " + rsWhat.getString(4)
                                + "  " + rsWhat.getString(5)
                );
            }
            dbCxn.close();
        }catch (Exception e){ System.out.println(e);}
    }

}