import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const UserEdit = ({ navigation }) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [profile, setProfile] = useState('');
    const [department, setDepartment] = useState('');
    const [hiringDate, setHiringDate] = useState('');
    const [center, setCenter] = useState('');

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const response = await fetch('http://localhost:3000/users/current/user', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('No se pudo obtener el usuario');
            }
            const data = await response.json();
            setId(data.id);
            setName(data.name);
            setEmail(data.email);
            setLastName(data.lastName);
            setDepartment(data.department);
            setProfile(data.profile);
            setHiringDate(data.hiringDate);
            setCenter(data.center);
        } catch (error) {
            Alert.alert('Error', 'Error al obtener los datos del usuario');
            console.error(error);
        }
    };

    const handleSave = async () => {
        const updatedUser = {
            id,
            name,
            lastName,
            profile,
            department,
            hiringDate,
            center,
            email,
        };

        try {
            const response = await fetch('http://localhost:3000/users/modificar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                Alert.alert('Error', 'Error al modificar los datos del usuario');
                return;
            }
            Alert.alert('Éxito', 'Usuario editado exitosamente');
        } catch (error) {
            Alert.alert('Error', 'Error al guardar los datos');
            console.error(error);
        }
    };

    const handleCancel = () => {
        Alert.alert('Cancelar', 'Edición cancelada');
        navigation.goBack(); // Regresar a la pantalla anterior
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Perfil Usuario</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ingrese su nombre"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Apellidos:</Text>
                <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Ingrese sus apellidos"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Perfil:</Text>
                <Picker
                    selectedValue={profile}
                    style={styles.picker}
                    onValueChange={(itemValue) => setProfile(itemValue)}
                >
                    <Picker.Item label="Seleccione..." value="" />
                    <Picker.Item label="Desarrollador" value="Desarrollador" />
                    <Picker.Item label="Tester" value="Tester" />
                    <Picker.Item label="Becario" value="Becario" />
                    <Picker.Item label="RRHH" value="RRHH" />
                    <Picker.Item label="Contabilidad" value="Contabilidad" />
                </Picker>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Departamento:</Text>
                <TextInput
                    style={styles.input}
                    value={department}
                    onChangeText={setDepartment}
                    placeholder="Ingrese su departamento"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha de Alta:</Text>
                <TextInput
                    style={styles.input}
                    value={hiringDate}
                    onChangeText={setHiringDate}
                    placeholder="YYYY-MM-DD"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Centro:</Text>
                <TextInput
                    style={styles.input}
                    value={center}
                    onChangeText={setCenter}
                    placeholder="Ingrese su centro"
                />
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Modificar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cerrar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};
UserEdit.propTypes = {
    navigation: PropTypes.shape({
        goBack: PropTypes.func.isRequired,
    }).isRequired,
};

export default UserEdit;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: '#fff',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: '#fff',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#28a745',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});
