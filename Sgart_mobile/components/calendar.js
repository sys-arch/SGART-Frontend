import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import '../App.css';
import { Agenda } from 'react-native-calendars';

const Calendar = () => {
	const [events, setEvents] = useState({
		'2024-12-08': [{ name: 'Reunión de Equipo', start: '10:00', end: '11:00' }],
		'2024-12-09': [{ name: 'Revisión del Proyecto', start: '15:00', end: '16:00' }],
	});

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Calendario de Reuniones</Text>
			<Agenda
				items={events}
				renderItem={(item) => (
					<View style={styles.eventItem}>
						<Text style={styles.eventName}>{item.name}</Text>
						<Text style={styles.eventTime}>
							{item.start} - {item.end}
						</Text>
					</View>
				)}
				renderEmptyData={() => (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>No hay eventos para este día.</Text>
					</View>
				)}
				theme={{
					agendaDayTextColor: 'black',
					agendaDayNumColor: 'black',
					agendaTodayColor: 'blue',
					agendaKnobColor: '#007bff',
				}}
			/>
		</View>
	);

	// Función para obtener el userId del usuario actual
	const getUserId = async () => {
		try {
			const response = await fetch('http://localhost:3000/users/current/userId', {
				credentials: 'include'
			});
			if (!response.ok) {
				throw new Error('No se pudo obtener el ID del usuario');
			}
			const data = await response.json();
			console.log("ID de usuario obtenido:", data.userId);
			return data.userId;
		} catch (error) {
			console.error('Error al obtener el ID del usuario:', error);
			return null;
		}
	};

	// Cargar invitados de una reunión
	const loadInvitees = useCallback(async (meetingId) => {
		try {
			console.log(`Cargando invitados para la reunión ID: ${meetingId}`);
			const response = await fetch(`http://localhost:3000/administrador/calendarios/invitados`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ meetingId }),
			});

			if (!response.ok) {
				throw new Error(`Error al cargar los invitados: ${response.statusText}`);
			}

			const backendInvitees = await response.json();
			console.log("Lista de invitados cargada:", backendInvitees);
			return backendInvitees;

		} catch (error) {
			console.error("Error al cargar los invitados:", error);
			return [];
		}
	}, []);

	// Cargar reuniones y clasificarlas según los invitados
	const loadMeetings = useCallback(async () => {
		try {
			setIsLoading(true);
			console.log("Iniciando carga de meetings...");

			// Obtener el userId del backend
			const currentUserId = await getUserId();
			console.log("ID del usuario actual:", currentUserId, "Tipo:", typeof currentUserId);

			if (!currentUserId) {
				throw new Error('No se pudo obtener el ID del usuario');
			}

			const response = await fetch('http://localhost:3000/administrador/calendarios/loadMeetings');
			if (!response.ok) {
				throw new Error(`Error al cargar los meetings: ${response.statusText}`);
			}

			const backendMeetings = await response.json();
			console.log("Total de reuniones recibidas:", backendMeetings.length);

			const acceptedMeetings = [];
			const pendingMeetings = [];

			// Procesar cada reunión y sus invitados
			for (const meeting of backendMeetings) {
				console.log(`\n--- Procesando reunión ID: ${meeting.meetingId} ---`);

				// Cargar invitados para esta reunión
				const invitados = await loadInvitees(meeting.meetingId);
				console.log(`Invitados recibidos para reunión ${meeting.meetingId}:`, invitados);

				// Imprimir cada invitado y su estado
				invitados.forEach(invitee => {
					console.log(`Invitado ID: ${invitee.userId} (${typeof invitee.userId}), Estado: "${invitee.status}"`);
				});

				const transformedMeeting = {
					id: meeting.meetingId,
					title: meeting.title || "Título no especificado",
					start: `${meeting.meetingDate}T${meeting.startTime}`,
					end: `${meeting.meetingDate}T${meeting.endTime}`,
					allDay: meeting.allDay,
					extendedProps: {
						locationName: meeting.locationName,
						observations: meeting.observations,
						organizerName: meeting.organizerName,
						invitees: invitados
					}
				};

				// Buscar la invitación del usuario actual por userId
				const currentUserInvitation = invitados.find(invitee => {
					console.log(`Comparando: invitado.userId=${invitee.userId} con currentUserId=${currentUserId}`);
					return invitee.userId.toString() === currentUserId.toString(); // Convertir ambos a string para comparar
				});

				if (currentUserInvitation) {
					console.log(`Estado de invitación encontrado: "${currentUserInvitation.status}"`);
					if (currentUserInvitation.status.trim() === 'Aceptada') {
						console.log(`Reunión ${meeting.meetingId} clasificada como ACEPTADA`);
						acceptedMeetings.push(transformedMeeting);
					} else if (currentUserInvitation.status.trim() === 'Pendiente') {
						console.log(`Reunión ${meeting.meetingId} clasificada como PENDIENTE`);
						pendingMeetings.push(transformedMeeting);
					}
				} else {
					console.log(`No se encontró invitación para el usuario actual (${currentUserId}) en la reunión ${meeting.meetingId}`);
				}
			}

			console.log("\n=== RESUMEN FINAL ===");
			console.log("Total reuniones aceptadas:", acceptedMeetings.length);
			console.log("Total reuniones pendientes:", pendingMeetings.length);

			// Actualizar estados
			setRegularEvents(acceptedMeetings);
			setPendingMeetingsEvents(pendingMeetings);
			setReunionesAceptadas(acceptedMeetings);
			setReunionesPendientes(pendingMeetings);

		} catch (error) {
			console.error("Error al cargar los meetings: ", error);
		} finally {
			setIsLoading(false);
		}
	}, [loadInvitees]);

	// Añadir esta función auxiliar cerca de otras funciones auxiliares
	const areAllInvitationsRejected = (invitees) => {
		if (!invitees || invitees.length === 0) return false;
		return invitees.every(invitee => invitee.status.trim() === 'Rechazada');
	};

	// Cargar las reuniones organizadas por el usuario
	const loadOrganizedMeetings = useCallback(async () => {
		try {
			console.log("Iniciando carga de reuniones organizadas...");
			const response = await fetch('http://localhost:3000/usuarios/calendarios/organized-meetings', {
				credentials: 'include'
			});

			if (!response.ok) {
				console.error('Error en la respuesta:', response.status, response.statusText);
				throw new Error('Error al cargar reuniones organizadas');
			}

			const backendMeetings = await response.json();
			console.log("Reuniones organizadas recibidas del backend:", backendMeetings);

			const transformedMeetings = await Promise.all(backendMeetings.map(async (meeting, index) => {
				console.log(`Procesando reunión organizada ${index + 1}:`, meeting);

				const invitados = await loadInvitees(meeting.meetingId);
				console.log(`Invitados cargados para reunión ${meeting.meetingId}:`, invitados);

				const allRejected = areAllInvitationsRejected(invitados);

				const transformedMeeting = {
					id: meeting.meetingId,
					title: meeting.title || "Título no especificado",
					start: `${meeting.meetingDate}T${meeting.startTime}`,
					end: `${meeting.meetingDate}T${meeting.endTime}`,
					allDay: meeting.allDay,
					backgroundColor: allRejected ? '#ffcccc' : '#ce93d8',
					allRejected: allRejected,
					className: allRejected ? 'rejected-meeting' : 'normal-meeting',
					extendedProps: {
						locationName: meeting.locationName,
						observations: meeting.observations,
						organizerName: meeting.organizerName,
						invitees: invitados
					}
				};

				console.log(`Reunión ${index + 1} transformada:`, transformedMeeting);
				return transformedMeeting;
			}));

			console.log("Total de reuniones organizadas transformadas:", transformedMeetings.length);
			console.log("Reuniones organizadas transformadas:", transformedMeetings);

			setOrganizedEvents(transformedMeetings);
			setReunionesOrganizadas(transformedMeetings);

		} catch (error) {
			console.error("Error detallado al cargar reuniones organizadas:", error);
		}
	}, [loadInvitees]);

	const checkAttendanceStatus = async (meetingId) => {
		try {
			const response = await fetch(`http://localhost:3000/invitations/${meetingId}/attendance`, {
				credentials: 'include'
			});

			if (!response.ok) {
				throw new Error('Failed to get attendance status');
			}

			const attendance = await response.json();
			return attendance === 1;
		} catch (error) {
			console.error('Error checking attendance status:', error);
			return false;
		}
	};

	// Modify the handleEventClick function
	const handleEventClick = async (clickInfo) => {
		const transformedEvent = {
			id: clickInfo.event.id,
			title: clickInfo.event.title,
			start: clickInfo.event.startStr,
			end: clickInfo.event.endStr,
			allDay: clickInfo.event.allDay,
			extendedProps: {
				locationName: clickInfo.event.extendedProps.locationName,
				observations: clickInfo.event.extendedProps.observations,
				organizerName: clickInfo.event.extendedProps.organizerName,
			}
		};

		// Cargar invitados frescos al hacer click
		const invitados = await loadInvitees(clickInfo.event.id);

		// Check attendance status if it's an accepted meeting
		if (regularEvents.find(event => event.id === clickInfo.event.id)) {
			const hasConfirmedAttendance = await checkAttendanceStatus(clickInfo.event.id);
			transformedEvent.extendedProps.hasConfirmedAttendance = hasConfirmedAttendance;
		}

		setInvitees(invitados);
		setSelectedEvent(transformedEvent);
		setIsEventDetailPopupOpen(true);
	};

	const handleConfirmAction = async () => {
		try {
			console.log('Iniciando actualización de estado para evento:', selectedEvent);
			console.log('Acción seleccionada:', confirmationAction);

			const url = `http://localhost:3000/invitations/${selectedEvent.id}/status`;
			console.log('URL de la petición:', url);

			const requestBody = {
				newStatus: confirmationAction === 'accept' ? 'Aceptada' : 'Rechazada',
				comment: ''
			};
			console.log('Cuerpo de la petición:', requestBody);

			const response = await fetch(url, {
				method: 'PUT', // Cambiado de PATCH a PUT
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			});

			console.log('Respuesta del servidor:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Error response:', errorText);
				throw new Error(`Error al actualizar el estado de la invitación: ${errorText}`);
			}

			await loadMeetings(); // Recargar reuniones después de la actualización
			console.log('Actualización completada con éxito');
		} catch (error) {
			console.error('Error detallado:', error);
		} finally {
			setShowConfirmation(false);
		}
	};

	// Añadir estas funciones para manejar la creación de reuniones
	const handleAddTimeClick = () => {
		setEventLocation("");
		setIsEditing(false);
		loadLocations();
		setPopupStartingHour('');
		setPopupStartingMinutes('');
		setPopupEndingHour('');
		setPopupEndingMinutes('');
		setEventName('');
		setPopupSelectedDate('');
		setEventFrequency('Una vez');
		setIsAllDay(false);
		setIsPopupOpen(true);
	};

	// Validación de los campos de TIEMPO una reunión
	const handleNextStep = () => {
		if (!eventName || !popupSelectedDate || !eventLocation.length) {
			alert("Por favor, completa todos los campos obligatorios antes de continuar.");
			return;
		}
		if (!isAllDay) {
			if (parseInt(popupStartingMinutes) + parseInt(popupStartingHour) * 60 > parseInt(popupEndingHour) * 60 + parseInt(popupEndingMinutes)) {
				alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
				return;
			}
			if (parseInt(popupStartingMinutes) > 59 || parseInt(popupStartingHour) > 23 || parseInt(popupEndingHour) > 23 || parseInt(popupEndingMinutes) > 59) {
				alert("El formato de horas que se ha establecido es incorrecto. Revíselo por favor.");
				return;
			}
			if (!popupEndingHour || !popupEndingMinutes || !popupStartingHour || !popupStartingMinutes) {
				alert("Por favor, completa todos los campos antes de continuar.");
				return;
			}

			// Añadir validación de horario laboral
			const startTimeValid = isTimeWithinWorkSchedule(parseInt(popupStartingHour), parseInt(popupStartingMinutes));
			const endTimeValid = isTimeWithinWorkSchedule(parseInt(popupEndingHour), parseInt(popupEndingMinutes));

			if (!startTimeValid || !endTimeValid) {
				const errorMsg = 'Las horas seleccionadas deben estar dentro del horario laboral establecido:' +
					workSchedules.map(schedule =>
						`\n${schedule.startingTime.slice(0, -3)} - ${schedule.endingTime.slice(0, -3)}`
					).join('');
				alert(errorMsg);
				return;
			}
		}

		setErrorEvent('');
		setSelectedUsers([]);
		loadUsers();
		loadAbsences();
		setCurrentStep(2);
	};

	// Botoón para cerrar el popup
	const handleClosePopup = () => {
		setIsPopupOpen(false);
		setCurrentStep(1);
		setIsEditingEvent(false);
	};

	const [workSchedules, setWorkSchedules] = useState([]);

	// Comprobar si la hora de la reunión está dentro del horario laboral
	const isTimeWithinWorkSchedule = (hour, minute) => {
		if (!workSchedules.length) {
			console.log('No hay horarios laborales definidos, permitiendo cualquier hora');
			return true;
		}

		const timeInMinutes = hour * 60 + parseInt(minute);
		console.log(`\nValidando tiempo: ${hour}:${minute} (${timeInMinutes} minutos)`);

		for (const schedule of workSchedules) {
			console.log(`\nComprobando bloque horario: ${schedule.startingTime} - ${schedule.endingTime}`);

			const startTime = schedule.startingTime.split(':').slice(0, 2).join(':');
			const endTime = schedule.endingTime.split(':').slice(0, 2).join(':');

			const [startHour, startMinute] = startTime.split(':').map(Number);
			const [endHour, endMinute] = endTime.split(':').map(Number);

			const scheduleStartMinutes = startHour * 60 + startMinute;
			const scheduleEndMinutes = endHour * 60 + endMinute;

			console.log(`Bloque en minutos: ${scheduleStartMinutes} - ${scheduleEndMinutes}`);
			console.log(`Tiempo a validar en minutos: ${timeInMinutes}`);

			if (timeInMinutes >= scheduleStartMinutes && timeInMinutes <= scheduleEndMinutes) {
				console.log('¡Tiempo válido! Está dentro de este bloque horario');
				return true;
			}
		}

		console.log('Tiempo no válido: No está dentro de ningún bloque horario');
		return false;
	};

	//! FUNCIÓN PARA CREAR UNA REUNIÓN O MODIFICAR UNA REUNIÓN EXISTENTE
	const handleSaveEvent = async () => {
		setErrorEvent('');

		// Validación de usuarios ausentes solo si hay usuarios seleccionados
		if (selectedUsers?.length > 0) {
			const ausentes = selectedUsers.filter((user) => user.enAusencia === true);
			if (ausentes.length > 0) {
				setErrorEvent("Error al crear la reunión. Se está intentando crear una reunión con participantes ausentes.");
				return;
			}
		}

		// Mínimo de un participante
		if (selectedUsers.length === 0) {
			setErrorEvent('Debes invitar al menos a un participante');
			return;
		}

		const startingTime = `${popupStartingHour.padStart(2, '0')}:${popupStartingMinutes.padStart(2, '0')}:00`;
		const endingTime = `${popupEndingHour.padStart(2, '0')}:${popupEndingMinutes.padStart(2, '0')}:00`;

		try {
			setIsLoading(true);
			const currentUserId = await getUserId();
			const newEvent = {
				organizerId: currentUserId,
				meetingTitle: eventName,
				meetingDate: popupSelectedDate,
				meetingAllDay: isAllDay ? 1 : 0,
				meetingStartTime: isAllDay ? '00:00:00' : startingTime,
				meetingEndTime: isAllDay ? '23:59:59' : endingTime,
				locationId: eventLocation,
				meetingObservations: popupDescription,
			};

			let response;
			let meetingId;

			if (isEditing) { //! MODIFICACIÓN DE UNA REUNIÓN EXISTENTE
				// Validación inicial de campos obligatorios para todos los casos
				if (!eventName || !popupSelectedDate || !eventLocation.length) {
					alert("Por favor, completa todos los campos obligatorios antes de continuar.");
					return;
				}

				if (!isAllDay) {
					// Validación de formato de hora existente
					if (!validateTimeInput(popupStartingHour, popupStartingMinutes, setPopupHourError, setPopupMinuteError) ||
						!validateTimeInput(popupEndingHour, popupEndingMinutes, setPopupHourError, setPopupMinuteError)) {
						alert("Por favor, corrige los campos de hora antes de guardar el evento.");
						return;
					}

					// Validación de campos de hora vacíos
					if (!popupEndingHour || !popupEndingMinutes || !popupStartingHour || !popupStartingMinutes) {
						alert("Por favor, completa todos los campos antes de continuar.");
						return;
					}

					// Validación de hora inicio > fin
					if (parseInt(popupStartingMinutes) + parseInt(popupStartingHour) * 60 > parseInt(popupEndingHour) * 60 + parseInt(popupEndingMinutes)) {
						alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
						return;
					}

					// Validación de formato de horas
					if (parseInt(popupStartingMinutes) > 59 || parseInt(popupStartingHour) > 23 ||
						parseInt(popupEndingHour) > 23 || parseInt(popupEndingMinutes) > 59) {
						alert("El formato de horas que se ha establecido es incorrecto. Revíselo por favor.");
						return;
					}

					// Añadir validación de horario laboral
					const startTimeValid = isTimeWithinWorkSchedule(parseInt(popupStartingHour), parseInt(popupStartingMinutes));
					const endTimeValid = isTimeWithinWorkSchedule(parseInt(popupEndingHour), parseInt(popupEndingMinutes));

					if (!startTimeValid || !endTimeValid) {
						const errorMsg = 'Las horas seleccionadas deben estar dentro del horario laboral establecido:' +
							workSchedules.map(schedule =>
								`\n${schedule.startingTime.slice(0, -3)} - ${schedule.endingTime.slice(0, -3)}`
							).join('');
						alert(errorMsg);
						return;
					}
				}
				response = await fetch(`http://localhost:3000/api/meetings/${eventIdToEdit}/modify`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify(newEvent)
				});
				meetingId = eventIdToEdit;

				if (!response.ok) {
					alert('Error al guardar el evento');
					return;
				}

				alert("Se ha modificado el evento de manera exitosa.");
			} else { // ! CREACIÓN DE UNA NUEVA REUNIÓN
				response = await fetch('http://localhost:3000/api/meetings/create', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify(newEvent),
				});
				const meetingData = await response.json();
				meetingId = meetingData.meetingId; // Assuming your backend returns the created meeting ID

				if (!response.ok) throw new Error('Error al guardar el evento');

				// Send invitations
				const userIds = selectedUsers.map(user => user.id);
				const inviteResponse = await fetch(`http://localhost:3000/invitations/${meetingId}/invite`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify(userIds),
				});

				if (!inviteResponse.ok) {
					alert('Error al enviar las invitaciones');
					return;
				}
				alert("Se ha creado el evento de manera exitosa.");

			}
			await loadMeetings();
			await loadOrganizedMeetings();
			setIsPopupOpen(false);
			setCurrentStep(1);
			setIsEditing(false);
			setEventIdToEdit(null);
		} catch (error) {
			console.error('Error:', error);
			setErrorEvent('Error al crear la reunión o enviar las invitaciones. Por favor, inténtalo de nuevo.');
		} finally {
			setIsLoading(false);
		}
	};

	// Función para validar el formato de tiempo
	const validateTimeInput = (hour, minute, setHourError, setMinuteError) => {
		const hourValid = hour >= 0 && hour <= 23;
		const minuteValid = minute >= 0 && minute <= 59;
		setHourError(!hourValid);
		setMinuteError(!minuteValid);
		return hourValid && minuteValid;
	};

	// Función para manejar cambios en los campos de tiempo
	const handlePopupTimeChange = (e, type) => {
		const value = e.target.value;
		if (type === 'popupStartingHour') {
			setPopupStartingHour(value);
			validateTimeInput(value, popupStartingMinutes, setPopupHourError, setPopupMinuteError);
		} else if (type === 'popupStartingMinutes') {
			setPopupStartingMinutes(value);
			validateTimeInput(popupStartingHour, value, setPopupHourError, setPopupMinuteError);
		} else if (type === 'popupEndingHour') {
			setPopupEndingHour(value);
			validateTimeInput(value, popupEndingMinutes, setPopupHourError, setPopupMinuteError);
		} else if (type === 'popupEndingMinutes') {
			setPopupEndingMinutes(value);
			validateTimeInput(popupEndingHour, value, setPopupHourError, setPopupMinuteError);
		}
	};

	// Función para cargar usuarios disponibles
	const loadUsers = async () => {
		try {
			// Obtener el ID del usuario actual
			const currentUserId = await getUserId();
			console.log('ID del usuario actual:', currentUserId);

			const response = await fetch('http://localhost:3000/api/meetings/available-users');
			if (!response.ok) {
				throw new Error('Error al cargar los usuarios');
			}

			const backendUsers = await response.json();
			console.log('Usuarios recibidos del backend:', backendUsers);
			const userId = await getUserId();

			// Filtrar excluyendo al usuario actual
			const transformedUsers = backendUsers
				.filter(user => {
					const isCurrentUser = user.id === currentUserId;
					console.log(`Comparando usuario ${user.name} (${user.id}) con usuario actual (${currentUserId}): ${isCurrentUser ? 'Es el mismo' : 'Es diferente'}`);
					return user.id !== userId;
				})
				.map(user => ({
					id: user.id,
					nombre: `${user.name} ${user.lastName}`
				}));

			console.log('Usuarios transformados (sin usuario actual):', transformedUsers);

			// Actualizar estados
			setAvailableUsers(transformedUsers);
			setFilteredParticipants(transformedUsers);

		} catch (error) {
			console.error('Error en loadUsers:', error);
		}
	};

	// Cargar las localizaciones
	// ! VAYA UNA MIERDA DE FUNCIÓN
	const loadLocations = (async () => {
		const response = await fetch('http://localhost:3000/api/meetings/locations');
		if (!response.ok) {
			console.log('Error al cargar las localizaciones');
			return;
		}
		const backendLocations = await response.json();
		const transformedLocations = backendLocations.map(location => ({
			locationId: location.locationId,
			locationName: location.locationName
		}));
		setLocations(transformedLocations);
	})

	// ! CARGAR AUSENCIAS
	const loadAbsences = (async () => {
		const response = await fetch('http://localhost:3000/administrador/ausencias/loadAbsences');
		if (!response.ok) {
			console.log('Error al cargar las ausencias');
			return;
		}

		const backendAbsences = await response.json();
		const transformedAbsences = backendAbsences.map(ausencia => ({
			absenceId: ausencia.absenceId,
			userId: ausencia.userId,
			absenceStartDate: ausencia.absenceStartDate,
			absenceEndDate: ausencia.absenceEndDate,
			absenceAllDay: ausencia.absenceAllDay,
			absenceStartTime: ausencia.absenceStartTime,
			absenceEndTime: ausencia.absenceEndTime,
			absenceReason: ausencia.absenceReason
		}));
		setAusencias(transformedAbsences);
		console.log(transformedAbsences);
	})

	// ! COMPROBAR AUSENCIAS
	const checkUserAbsence = (participant) => {
		return ausencias.some((ausencia) => {
			// Para la ausencia
			const startTime = ausencia.absenceAllDay === true ? '00:00:00' : ausencia.absenceStartTime;
			const endTime = ausencia.absenceAllDay === true ? '23:59:00' : ausencia.absenceEndTime;

			const ausenciaFechaInicio = createDateWithDayAndTime(ausencia.absenceStartDate, startTime);
			const ausenciaFechaFin = createDateWithDayAndTime(ausencia.absenceEndDate, endTime);

			// Para la fecha seleccionada
			const selectedStartTime = isAllDay === true ? '00:00:00' : (popupStartingHour + ":" + popupStartingMinutes + ":00");
			const selectedEndTime = isAllDay === true ? '23:59:00' : (popupEndingHour + ":" + popupEndingMinutes + ":00");

			const selectedFechaInicio = createDateWithDayAndTime(popupSelectedDate, selectedStartTime);
			const selectedFechaFin = createDateWithDayAndTime(popupSelectedDate, selectedEndTime);
			return (
				ausencia.userId === participant.id &&
				((ausenciaFechaInicio > selectedFechaInicio && ausenciaFechaInicio < selectedFechaFin) ||
					(ausenciaFechaFin > selectedFechaInicio && ausenciaFechaFin < selectedFechaFin) ||
					(ausenciaFechaFin > selectedFechaFin && ausenciaFechaInicio < selectedFechaInicio))
			);
		});
	};

	// Dar formato a la fecha y hora
	const createDateWithDayAndTime = (fecha, horaMinuto) => {
		const [year, month, day] = fecha.split('-').map(Number);
		const [hour, minute, second] = horaMinuto.split(':').map(Number);
		const date = new Date(year, month - 1, day, hour, minute, second);

		return date;
	};

	// ! AÑADIR PARTICPANTES
	const handleSelectParticipant = (participant) => {
		if (!selectedUsers.some(user => user.id === participant.id)) {
			const enAusencia = checkUserAbsence(participant);
			setSelectedUsers(prev => [...prev, { ...participant, enAusencia }]);
			setAvailableUsers(prev => prev.filter(user => user.id !== participant.id));
			setFilteredParticipants(prev => prev.filter(user => user.id !== participant.id));
		}
	};

	// ! ELIMINAR PARTICIPANTES
	const handleRemoveUser = (user) => {
		setSelectedUsers(prev => prev.filter(selectedUser => selectedUser.id !== user.id));
		setAvailableUsers(prev => {
			if (!prev.some(u => u.id === user.id)) {
				return [...prev, user];
			}
			return prev;
		});
		setFilteredParticipants(prev => {
			if (!prev.some(u => u.id === user.id)) {
				return [...prev, user];
			}
			return prev;
		});
	};

	// Add this new function near other handler functions
	const handleAttendanceUpdate = async (meetingId) => {
		try {
			const response = await fetch(`http://localhost:3000/invitations/${meetingId}/attendance`, {
				method: 'PUT',
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to update attendance');
			}

			// Update both regularEvents and reunionesAceptadas
			const updateEvents = (events) =>
				events.map(event =>
					event.id === meetingId
						? { ...event, extendedProps: { ...event.extendedProps, hasConfirmedAttendance: true } }
						: event
				);

			setRegularEvents(prevEvents => updateEvents(prevEvents));
			setReunionesAceptadas(prevEvents => updateEvents(prevEvents));

			// Force re-render by updating the selectedEvent
			setSelectedEvent(prev => ({
				...prev,
				extendedProps: { ...prev.extendedProps, hasConfirmedAttendance: true }
			}));

		} catch (error) {
			console.error('Error updating attendance:', error);
		}
	};

	const [isEditing, setIsEditing] = useState(false);
	const [eventIdToEdit, setEventIdToEdit] = useState(null);
	const [isEditingEvent, setIsEditingEvent] = useState(false);


	const handleModifyEvent = (event) => {
		loadLocations();
		setIsEditing(true);  // Indicamos que estamos editando un eventos
		setEventIdToEdit(event.id);
		setIsEditingEvent(true);
		setEventName(event.title);
		setEventLocation(event.extendedProps.locationId);
		setPopupDescription(event.extendedProps.observations);
		setPopupSelectedDate(event.start.split('T')[0]);
		if (event.allDay) {
			setIsAllDay(true);
		} else {
			setIsAllDay(false);
			const [startHour, startMinutes] = event.start.split('T')[1].split(':');
			setPopupStartingHour(startHour);
			setPopupStartingMinutes(startMinutes);

			const [endHour, endMinutes] = event.end.split('T')[1].split(':');
			setPopupEndingHour(endHour);
			setPopupEndingMinutes(endMinutes);
		}
		setIsPopupOpen(true);
		setCurrentStep(1);
	};

	const handleDeleteEvent = async (reunion) => {
		try {
			// Mostrar un mensaje de confirmación antes de eliminar la reunión
			if (!window.confirm(`¿Estás seguro de que quieres eliminar la reunión "${reunion.title}"?`)) {
				return;
			}

			// Hacer una petición DELETE al backend para eliminar la reunión
			const response = await fetch(`http://localhost:3000/api/meetings/${reunion.id}/cancel`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || 'Error al eliminar la reunión');
			}

			// Actualizar las reuniones organizadas para eliminar la reunión eliminada
			setOrganizedEvents(prevEvents => prevEvents.filter(event => event.id !== reunion.id));
			setReunionesOrganizadas(prevMeetings => prevMeetings.filter(meeting => meeting.id !== reunion.id));

			alert('La reunión se ha eliminado correctamente.');
		} catch (error) {
			console.error('Error al eliminar la reunión:', error);
			alert('Hubo un error al intentar eliminar la reunión. Por favor, inténtalo de nuevo.');
		}
	};

	
};


export default Calendar;
