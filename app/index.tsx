import { Text, View, SafeAreaView, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";

interface Vendor {
  id: number;
  name: string;
  location_name: string;
  latitude: number;
  longitude: number;
  services: string[];
}

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [backupVendors, setBackupVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [isCitySearch, setIsCitySearch] = useState(false);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        console.log("User Location:", location.coords.latitude, location.coords.longitude);
        await fetchNearbyVendors(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error("Error getting location:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLocation();
  }, []);

  const showToast = (message: string) => {
    Toast.show({
      type: "info",
      text1: message,
      position: "bottom",
      visibilityTime: 3000,
    });
  };

  const fetchNearbyVendors = async (latitude: number, longitude: number) => {
    setNearbyLoading(true);
    showToast("Fetching...");
    try {
      console.log("Fetching vendors for:", latitude, longitude);
      const response = await axios.get("http://192.168.29.89:5000/api/vendors/nearby", {
        params: { latitude, longitude },
      });
      console.log("API Response:", response.data);
      setVendors(response.data);
      setBackupVendors(response.data);
      setFilteredVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setNearbyLoading(false);
      setLoading(false);
    }
  };

  const fetchVendorsByLocation = async (location_name: string) => {
    setSearchLoading(true);
    showToast("Fetching...");
    try {
      console.log("Fetching vendors for location:", location_name);
      const response = await axios.get("http://192.168.29.89:5000/api/vendors/location", {
        params: { location_name },
      });
      console.log("API Response:", response.data);
      setVendors(response.data);
      setBackupVendors(response.data);
      setFilteredVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    console.log("Searching for:", searchTerm);

    const isCitySearch = ["Hyderabad", "Bangalore", "Chennai", "Mumbai", "Delhi"].some((city) =>
      searchTerm.toLowerCase().includes(city.toLowerCase())
    );

    if (isCitySearch) {
      fetchVendorsByLocation(searchTerm);
      setIsCitySearch(true);
    } else {
      const filtered = backupVendors.filter(
        (vendor) =>
          vendor.services &&
          vendor.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredVendors(filtered);
      setIsCitySearch(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F2B28C" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Laundry Solutions</Text>

      <TextInput
        placeholder="Search by city or service"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={searchLoading}>
        <Text style={styles.buttonText}>{searchLoading ? "Searching..." : "Search"}</Text>
      </TouchableOpacity>

      {!isCitySearch && userLocation && (
        <TouchableOpacity
          style={[styles.button, styles.nearbyButton]}
          onPress={() => fetchNearbyVendors(userLocation.latitude, userLocation.longitude)}
          disabled={nearbyLoading}
        >
          <Text style={styles.buttonText}>{nearbyLoading ? "Fetching..." : "Find Nearby Vendors"}</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredVendors}
        keyExtractor={(item, index) => `${item.id}-${item.location_name}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.vendorCard}>
            <Text style={styles.vendorName}>
              {item.name} - {item.location_name}
            </Text>
            <Text style={styles.vendorServices}>
              Services: {item.services.length > 0 ? item.services.join(", ") : "No services available"}
            </Text>
          </View>
        )}
      />

      {/* Toast Component */}
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F6DED8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#F2B28C",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderColor: "#F2B28C",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#F2B28C",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  nearbyButton: {
    backgroundColor: "#48A6A7",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  vendorCard: {
    backgroundColor: "#F6DED8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#F2B28C",
    borderWidth: 1,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F2B28C",
  },
  vendorServices: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

