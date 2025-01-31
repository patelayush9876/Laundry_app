import { Text, View, SafeAreaView, TextInput, Button, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the Vendor interface
interface Vendor {
  id: number;
  name: string;
  location_name: string;
  services: string[];
}

export default function Index() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isloading, setisloading] = useState(true);

  useEffect(() => {
    // Fetch vendors from the backend API
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://192.168.29.89:5000/api/vendors/location", {
          params: { location_name:['Hyderabad', 'Delhi', 'Bengaluru', 'Mumbai', 'Noida'] } // Example location_name
        });
        setVendors(response.data);
        // setFilteredVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
      finally{
        setisloading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleSearch = () => {
    const filtered = vendors.filter(vendor =>
      vendor.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      (vendor.services && vendor.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))),
      console.log(vendors)
      
    );
    setFilteredVendors(filtered);
  };
  if (isloading) {
    return(
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }
  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Search by location or service"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />
        <Button title="Search" onPress={handleSearch} />
        <FlatList
          data={filteredVendors}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 10 }}>
              <Text>{item.name} - {item.location_name}</Text>
              <Text>Services: {Array.isArray(item.services) && item.services.length > 0 ? item.services.join(', ') : 'No services available'}</Text>

              {/* <Text>Services: {JSON.stringify(item.services)? item.services.join(', ') : 'No services available'}</Text> */}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
