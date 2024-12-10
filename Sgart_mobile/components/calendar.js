import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CalendarScreen = ({ navigation }) => {
	return (
		<View style={styles.container}>
		<Text style={styles.title}>Calendario</Text>
		<Button title="Añadir Reunión" onPress={() => navigation.navigate('MeetingCreator')}  />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f4f4f4',
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 20,
	},
});

export default CalendarScreen;
