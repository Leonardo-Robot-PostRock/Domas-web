"use client"

import {
	Container,
	Box,
	Flex,
	Button,
	Badge,
	Text,
	Link,
	FormControl,
	FormLabel,
	Tooltip,
	Divider,
	Icon,
	Input,
	Checkbox,
	Textarea,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
	Alert,
	AlertIcon,
	AlertDescription,
	AlertTitle,
} from "@chakra-ui/react";
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import {
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
} from "@chakra-ui/react";
import { List, ListItem, ListIcon, UnorderedList } from "@chakra-ui/react";
import {
	FaTimes,
	FaCircle,
	FaExclamationTriangle,
	FaCheckCircle,
	FaTimesCircle,
	FaLink,
	FaUnlink,
	FaRegQuestionCircle,
} from "react-icons/fa";
import { IoLogoWhatsapp, IoIosArrowDropdown, IoMdPerson } from "react-icons/io";
import {
	MdOutlineSignalWifiOff,
	MdOutlineSignalWifiStatusbar4Bar,
	MdSignalWifiStatusbarNotConnected,
} from "react-icons/md";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { useColorModeValue, useDisclosure, useToast } from "@chakra-ui/react";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { Controller, set, useForm } from "react-hook-form";
import Table from "@/components/Datatable/OrdersTable.js";
import fetcher from "@/utils/Fetcher";
import useSWR, { mutate } from "swr";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import Select from "react-select";
import { toastError, toastSuccess } from "@/components/Toast.js";
import { Toaster } from "react-hot-toast";
import { convertirCoordenadas } from "@/utils/Geolocation";
import { checkTicketStatus } from "@/utils/CheckStatus";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Argentina/Mendoza");

let selectedRows = [];

const ContextFetchTkFromDB = createContext();

const Index = () => {
	const [user, setUser] = useState();
	const [fetchOrders, setFetchOrders] = useState(null);

	let { data, error } = useSWR(`api/supervisor/getTicketsFromDb`, fetcher);
	let { data: workersData, error: errorWorkersData } = useSWR(
		`/api/supervisor/getWorkersOrders`,
		fetcher
	);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));

		if (user) {
			user.roles = user.roles.map((item) => item.name);
			setUser(user);
		}
	}, []);

	useEffect(() => {
		if (fetchOrders) {
			mutate(`/api/supervisor/getTicketsFromDb`, null, true);
			mutate(`/api/supervisor/getWorkersOrders`, null, true);
		}
	}, [fetchOrders]);

	return (
		<Container
			maxW={{ base: "100%", md: "90%" }}
			backgroundColor={"white"}
			borderRadius={10}
			border={`1px solid #E3EAF2`}
			p={{ base: 2, md: 5 }}
			mt={10}
		>
			<Toaster />

			<Text
				textAlign={"center"}
				fontWeight={"bold"}
				fontSize={"4xl"}
				mt={4}
				mb={4}
				color={"#319DA0"}
			>
				{" "}
				ORDENES DEL DÍA{" "}
			</Text>

			<Tabs isLazy variant="enclosed">
				<TabList>
					<Tab _selected={{ color: "white", bg: "#319795" }}>
						Categorías Críticas
					</Tab>
					<Tab _selected={{ color: "white", bg: "#319795" }}>
						Categorías No Críticas
					</Tab>
				</TabList>
				<ContextFetchTkFromDB.Provider
					value={{ fetchFromDB: fetchOrders, setFetchFromDB: setFetchOrders }}
				>
					<TabPanels>
						<TabPanel>
							{user && data && workersData && (
								<Orders
									categories={"critical"}
									user={user}
									supervisorData={data}
									workersData={workersData}
								/>
							)}
						</TabPanel>

						<TabPanel>
							{user && data && workersData && (
								<Orders
									categories={"not-critical"}
									user={user}
									supervisorData={data}
									workersData={workersData}
								/>
							)}
						</TabPanel>
					</TabPanels>
				</ContextFetchTkFromDB.Provider>
			</Tabs>
		</Container>
	);
};

const Orders = ({ categories, user, supervisorData, workersData }) => {
	let filteredWorkerData;
	let filteredSupervisorData;

	const filterCategories = (tickets) => {
		if (categories == "critical") {
			return tickets.filter((ticket) =>
				[
					"SIN INTERNET",
					"SIN INTERNET FO",
					"ANTI-BAJA SERVICIO TÉCNICO",
				].includes(ticket.ticket_category)
			);
		} else if (categories == "not-critical") {
			return tickets.filter(
				(ticket) =>
					![
						"SIN INTERNET",
						"SIN INTERNET FO",
						"ANTI-BAJA SERVICIO TÉCNICO",
					].includes(ticket.ticket_category)
			);
		}
	};

	if (supervisorData) {
		if (!supervisorData.message) {
			let clonedData = JSON.parse(JSON.stringify(supervisorData));
			if (user.roles.includes("SUPERVISOR")) {
				filteredSupervisorData = [
					{
						tickets: filterCategories(clonedData.tickets),
						worker: { name: user.name, worker_id: user.id },
					},
				];
			} else if (user.roles.includes("ADMINISTRADOR")) {
				filteredSupervisorData = clonedData.map((order) => {
					order.tickets = filterCategories(order.tickets);
					return order;
				});
			}
		} else {
			filteredSupervisorData = [];
		}
	}

	if (workersData) {
		let clonedData = JSON.parse(JSON.stringify(workersData));
		filteredWorkerData = clonedData.orders.map((order) => {
			order.tickets = filterCategories(order.tickets);
			return order;
		});
	}

	return (
		<Box w={"95%"} mx={"auto"}>
			<Flex
				direction={{ base: "column", md: "row" }}
				wrap={"wrap"}
				justifyContent={"center"}
				gap={{ base: 1, md: 10 }}
			>
				{filteredWorkerData &&
					filteredWorkerData.map((order, index) => {
						return (
							<Box
								key={index}
								my={2}
								p={3}
								border={"3px solid #38B2AC"}
								rounded={"lg"}
								w={{ base: "100%", md: "20%" }}
							>
								<Text
									fontWeight={"semibold"}
									fontSize={14}
									textAlign={"center"}
								>
									{" "}
									Coordinador{" "}
								</Text>
								<Text
									fontWeight={"semibold"}
									fontSize={14}
									textAlign={"center"}
									mb={2}
								>
									{order.worker.name}
								</Text>
								<Text fontSize={14} textAlign={"center"}>
									{
										order.tickets.filter(
											(t) =>
												t.ticket_status == "PENDIENTE" ||
												t.ticket_status == "RECOORDINAR"
										).length
									}{" "}
									tickets por coordinar{" "}
								</Text>
							</Box>
						);
					})}
			</Flex>
			{filteredSupervisorData && (
				<MyOrder
					data={filteredSupervisorData}
					user={user}
					categorie={categories}
				/>
			)}
			<Divider style={{ border: "2px solid #319795" }} />
			{filteredWorkerData && <WorkerOrders data={filteredWorkerData} />}
		</Box>
	);
};

const MyOrder = ({ data, user, categorie }) => {
	const [filteredData, setFilteredData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const contextFetchTk = useContext(ContextFetchTkFromDB);

	const toastIdRef = useRef();

	async function handleCheckStatus(row) {
		let ordersAux = [];

		for (const order of filteredData) {
			let orderAux = {
				...order,
				tickets: [],
			};

			for (const ticket of order.tickets) {
				if (ticket.id == row.id) {
					ticket.connectionStatus = await checkTicketStatus(ticket);
					orderAux.tickets.push(ticket);
				} else {
					orderAux.tickets.push(ticket);
				}
			}

			ordersAux.push(orderAux);
		}

		setFilteredData(ordersAux);
	}

	const supervisorColumns = [
		{
			name: "Geo",
			cell: (row) => (
				<FaCircle
					color={
						row.customer.geocode.latitude
							? "rgb(51, 204, 51)"
							: "rgb(255, 0, 0)"
					}
				/>
			),
			width: "5%",
			center: true,
			compact: true,
		},
		{
			name: "Estado",
			selector: (row) => row.ticket_status,
			cell: (row) =>
				row.ticket_status == "REVISAR" ? (
					row.Ticket_history &&
					row.Ticket_history[row.Ticket_history.length - 1].ticket_status ==
						"COORDINADO" ? (
						<FaExclamationTriangle color={"rgb(255, 0, 0)"} fontSize={15} />
					) : row.Ticket_history &&
					  row.Ticket_history[row.Ticket_history.length - 1].ticket_status ==
							"RECOORDINAR" ? (
						<FaExclamationTriangle color={"rgb(255, 153, 0)"} fontSize={15} />
					) : row.Ticket_history &&
					  row.Ticket_history[
							row.Ticket_history.length - 1
					  ].description.includes("OPERADOR") ? (
						<IoLogoWhatsapp color={"rgb(0, 204, 0)"} fontSize={15} />
					) : (
						<FaExclamationTriangle color={"rgb(255, 224, 102)"} fontSize={15} />
					)
				) : row.ticket_status == "CERRADO" ? (
					<FaTimesCircle color={"rgb(255, 0, 0)"} fontSize={15} />
				) : (
					<FaCheckCircle color={"rgb(51, 133, 255)"} fontSize={15} />
				),
			maxWidth: "12%",
			minWidth: "5%",
			center: true,
			compact: true,
			sortable: true,
		},
		{
			name: "#",
			selector: (row) => row.id,
			cell: (row) => (
				<Link
					href={`http://mesa.westnet.com.ar/ticket/ver/${row.id}`}
					isExternal
				>
					{" "}
					{row.id}{" "}
				</Link>
			),
			maxWidth: "10%",
			center: true,
			sortable: true,
		},
		{
			name: "Reiterado",
			selector: (row) => row.recurrent,
			cell: (row) =>
				row.recurrent != null && row.recurrent >= 1 ? (
					<Link
						href={`http://mesa.westnet.com.ar/ticket#codigo_cliente.${row.customer.code}`}
						isExternal
					>
						<Text color={"red"}>{row.recurrent}</Text>
					</Link>
				) : (
					<Text> No </Text>
				),
			maxWidth: "12%",
			minWidth: "5%",
			center: true,
			compact: true,
			sortable: true,
		},
		{
			name: "Equipo",
			selector: (row) => row.Team?.name || "-",
			maxWidth: "8%",
			center: true,
			sortable: true,
		},
		{
			name: "Alta",
			selector: (row) =>
				dayjs.tz(new Date(row.ticket_created_at)).format("DD/MM/YYYY"),
			maxWidth: "20%",
			center: true,
			sortable: true,
		},
		{
			name: "Categoría",
			selector: (row) => row.ticket_category,
			sortable: true,
			maxWidth: "20%",
		},
		{
			name: "Conexión",
			selector: (row) => row.connectionStatus?.status,
			cell: (row) => {
				if (row?.connectionStatus?.status == "online") {
					return (
						<Icon
							as={
								row.connectionStatus.tech == "wireless"
									? MdOutlineSignalWifiStatusbar4Bar
									: FaLink
							}
							style={{ display: "inline", cursor: "pointer" }}
							boxSize={4}
							color={"#45B05F"}
							onClick={() => handleCheckStatus(row)}
						/>
					);
				} else if (row?.connectionStatus?.status == "offline") {
					return (
						<Icon
							as={
								row.connectionStatus.tech == "wireless"
									? MdOutlineSignalWifiOff
									: FaUnlink
							}
							style={{ display: "inline", cursor: "pointer" }}
							boxSize={4}
							color={"red"}
							onClick={() => handleCheckStatus(row)}
						/>
					);
				} else if (
					row?.connectionStatus?.status == "unknown" ||
					row.connectionStatus == null
				) {
					return (
						<Icon
							as={FaRegQuestionCircle}
							style={{ display: "inline", cursor: "pointer" }}
							boxSize={4}
							onClick={() => handleCheckStatus(row)}
						/>
					);
				}
			},
			maxWidth: "10%",
			sortable: false,
			center: true,
			compact: true,
		},
	];

	async function getTicketsFromMesa() {
		setIsLoading(true);
		await axios
			.get(`/api/supervisor/createWorkOrder?categories=${categorie}`)
			.then((res) => {
				toastSuccess("Orden creada correctamente.");
				contextFetchTk.setFetchFromDB(new Date());
			})
			.catch((err) => {
				toastError("Hubo un error al solicitar los tickets.");
			})
			.finally((value) => setIsLoading(false));
	}

	useEffect(() => {
		if (data.length > 0) {
			let dataAux = data.filter((order) => order.tickets.length > 0);
			setFilteredData(dataAux);
		}
	}, [data]);

	return (
		<Box my={5}>
			<Flex
				direction={"row"}
				wrap={"wrap"}
				justifyContent={"space-between"}
				alignItems={"center"}
			>
				<Text fontSize="18" fontWeight={"semibold"} my={4}>
					{" "}
					{user.roles.includes("SUPERVISOR") ? "Supervisor" : "Supervisores"}
				</Text>
				{categorie == "not-critical" && user.roles.includes("SUPERVISOR") && (
					<Button
						isLoading={isLoading}
						loadingText={"Cargando..."}
						colorScheme="teal"
						size={"sm"}
						onClick={getTicketsFromMesa}
					>
						Solicitar Tickets
					</Button>
				)}
			</Flex>

			<Accordion allowToggle w={{ base: "100%", md: "85%" }} mx={"auto"}>
				{filteredData &&
					filteredData.map((order, index) => {
						return (
							<AccordionItemContent
								key={index}
								order={order}
								columns={supervisorColumns}
								toastIdRef={toastIdRef}
							/>
						);
					})}
			</Accordion>
			{!filteredData.length && (
				<Text
					as="i"
					fontSize="14"
					fontWeight={"medium"}
					w={"100%"}
					my={5}
					ml={5}
				>
					No hay tickets para mostrar...
				</Text>
			)}

			{filteredData.length > 0 && (
				<Accordion
					allowToggle
					bg={"#EDF2F7"}
					w={{ base: "100%", md: "85%" }}
					mx={"auto"}
				>
					<AccordionItem>
						<h2>
							<AccordionButton
								alignContent={"center"}
								justifyContent={"center"}
							>
								<Box display="flex" flexDirection={"row"} fontSize={13}>
									<Text fontWeight={"bold"}> Referencia Estados </Text>
									<AccordionIcon mx={2} style={{ display: "inline" }} />
								</Box>
							</AccordionButton>
						</h2>
						<AccordionPanel pb={4}>
							<Box
								display={"flex"}
								flexWrap={"wrap"}
								alignItems={"normal"}
								mt={2}
								gap={2}
								bg={"transparent"}
								justifyContent={"center"}
							>
								<Box
									display={"flex"}
									flexWrap={"wrap"}
									flexDirection={"column"}
									mr={10}
								>
									<Text>Tickets a Revisar</Text>
									<Tooltip
										label={
											"Tickets en orden de trabajo del coordinador del día de ayer."
										}
									>
										<Box display={"flex"} alignItems={"center"} gap={2}>
											<FaExclamationTriangle
												style={{ display: "inline" }}
												color={"rgb(255, 224, 102)"}
												fontSize={"14px"}
											/>
											<Text mt={1} fontSize={"14px"}>
												PENDIENTE
											</Text>
										</Box>
									</Tooltip>

									<Tooltip
										label={
											"Tickets en orden de trabajo del coordinador del día de ayer."
										}
									>
										<Box display={"flex"} alignItems={"center"} gap={2}>
											<FaExclamationTriangle
												style={{ display: "inline" }}
												color={"rgb(255, 153, 0)"}
												fontSize={"14px"}
											/>
											<Text mt={1} fontSize={"14px"}>
												RECOORDINAR
											</Text>
										</Box>
									</Tooltip>

									<Tooltip
										label={
											"Tickets coordinados para el día de ayer. No fueron o no lo cerraron."
										}
									>
										<Box display={"flex"} alignItems={"center"} gap={2}>
											<FaExclamationTriangle
												style={{ display: "inline" }}
												color={"rgb(255, 0, 0)"}
												fontSize={"14px"}
											/>
											<Text mt={1} fontSize={"14px"}>
												COORDINADO
											</Text>
										</Box>
									</Tooltip>
								</Box>
								<Box
									display={"flex"}
									flexWrap={"wrap"}
									flexDirection={"column"}
								>
									<Text>Orden del Supervisor</Text>
									<Tooltip
										label={
											"Tickets que no se pudieron de coordinar a traves de Wise/IVR."
										}
									>
										<Box display={"flex"} alignItems={"center"} gap={2}>
											<IoLogoWhatsapp
												style={{ display: "inline" }}
												color={"rgb(0, 204, 0)"}
												fontSize={"15px"}
											/>
											<Text mt={1} fontSize={"14px"}>
												OMNICANAL
											</Text>
										</Box>
									</Tooltip>

									{user.roles.includes("ADMINISTRADOR") && (
										<Tooltip
											label={"Tickets que fueron cerrados por el Supervisor."}
										>
											<Box display={"flex"} alignItems={"center"} gap={2}>
												<FaTimesCircle color={"rgb(255, 0, 0)"} fontSize={15} />
												<Text mt={1} fontSize={"14px"}>
													CERRADO POR SUPERVISOR
												</Text>
											</Box>
										</Tooltip>
									)}

									<Tooltip
										label={
											"Tickets nuevos en orden de trabajo del día actual del supervisor."
										}
									>
										<Box display={"flex"} alignItems={"center"} gap={2}>
											<FaCheckCircle
												style={{ display: "inline" }}
												color={"rgb(51, 133, 255)"}
												fontSize={"14px"}
											/>
											<Text mt={1} fontSize={"14px"}>
												ORDEN DE HOY
											</Text>
										</Box>
									</Tooltip>
								</Box>
							</Box>
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			)}
		</Box>
	);
};

const WorkerOrders = ({ data }) => {
	const [filteredData, setFilteredData] = useState([]);

	const toastIdRef = useRef();

	async function handleCheckStatus(row) {
		let ordersAux = [];

		for (const order of filteredData) {
			let orderAux = {
				...order,
				tickets: [],
			};

			for (const ticket of order.tickets) {
				if (ticket.id == row.id) {
					ticket.connectionStatus = await checkTicketStatus(ticket);
					orderAux.tickets.push(ticket);
				} else {
					orderAux.tickets.push(ticket);
				}
			}

			ordersAux.push(orderAux);
		}

		setFilteredData(ordersAux);
	}

	const coordinatorColumns = [
		{
			name: "#",
			selector: (row) => row.id,
			width: "10%",
			center: true,
			compact: true,
			sortable: true,
		},
		{
			name: "Reiterado",
			selector: (row) => row.recurrent,
			cell: (row) =>
				row.recurrent != null && row.recurrent >= 1 ? (
					<Link
						href={`http://mesa.westnet.com.ar/ticket#codigo_cliente.${row.customer.code}`}
						isExternal
					>
						<Text color={"red"}>{row.recurrent}</Text>
					</Link>
				) : (
					<Text> No </Text>
				),
			maxWidth: "12%",
			minWidth: "5%",
			center: true,
			compact: true,
			sortable: true,
		},
		{
			name: "Equipo",
			selector: (row) => row.Team.name,
			maxWidth: "10%",
			center: true,
			sortable: true,
		},
		{
			name: "Alta",
			selector: (row) =>
				dayjs.tz(new Date(row.ticket_created_at)).format("DD/MM/YYYY"),
			width: "15%",
			center: true,
			compact: true,
			sortable: true,
		},
		{
			name: "Visita",
			selector: (row) =>
				row.appointment_date
					? dayjs.tz(row.appointment_date).format("DD/MM/YYYY")
					: "-",
			width: "15%",
			center: true,
			compact: true,
			sortable: true,
		},
		{
			name: "Categoría",
			selector: (row) => row.ticket_category,
			maxWidth: "20%",
			sortable: true,
		},
		{
			name: "Estado",
			selector: (row) => row.ticket_status,
			cell: (row) => (
				<Badge
					colorScheme={
						row.ticket_status == "PENDIENTE"
							? "yellow"
							: row.ticket_status == "COORDINADO"
							? "green"
							: row.ticket_status == "RECOORDINAR"
							? "blue"
							: row.ticket_status == "NO COORDINADO"
							? "red"
							: row.ticket_status == "VERIFICAR"
							? "purple"
							: "gray"
					}
				>
					{row.ticket_status}
				</Badge>
			),
			sortable: true,
		},
		{
			name: "Conexión",
			selector: (row) => {
				//console.log(row.id, row?.connectionStatus?.status);
				if (row?.connectionStatus?.status == "online") {
					return (
						<Icon
							as={
								row.connectionStatus.tech == "wireless"
									? MdOutlineSignalWifiStatusbar4Bar
									: FaLink
							}
							style={{ display: "inline", cursor: "pointer" }}
							boxSize={4}
							color={"#45B05F"}
							onClick={() => handleCheckStatus(row)}
						/>
					);
				} else if (row?.connectionStatus?.status == "offline") {
					return (
						<Icon
							as={
								row.connectionStatus.tech == "wireless"
									? MdOutlineSignalWifiOff
									: FaUnlink
							}
							style={{ display: "inline", cursor: "pointer" }}
							boxSize={4}
							color={"red"}
							onClick={() => handleCheckStatus(row)}
						/>
					);
				} else if (
					row?.connectionStatus?.status == "unknown" ||
					row.connectionStatus == null
				) {
					return (
						<Icon
							as={FaRegQuestionCircle}
							style={{ display: "inline", cursor: "pointer" }}
							boxSize={4}
							onClick={() => handleCheckStatus(row)}
						/>
					);
				}
			},
			sortable: false,
			compact: true,
			center: true,
		},
	];

	useEffect(() => {
		if (data.length > 0) {
			setFilteredData(data.filter((order) => order.tickets.length > 0));
		}
	}, [data]);

	return (
		<Box my={5}>
			<Text fontSize="18" fontWeight={"semibold"} w={"100%"} my={5}>
				{" "}
				Coordinadores{" "}
			</Text>

			<Accordion allowToggle w={{ base: "100%", md: "85%" }} mx={"auto"}>
				{filteredData &&
					filteredData.map((order, index) => {
						return (
							<AccordionItemContent
								key={index}
								order={order}
								columns={coordinatorColumns}
								toastIdRef={toastIdRef}
							/>
						);
					})}
			</Accordion>
			{!filteredData.length && (
				<Text
					as="i"
					fontSize="14"
					fontWeight={"medium"}
					w={"100%"}
					my={5}
					ml={5}
				>
					{" "}
					No hay ordenes para mostrar...{" "}
				</Text>
			)}
		</Box>
	);
};

const AccordionItemContent = ({ order, columns, toastIdRef }) => {
	const defaultOrder = {
		auxData: order.tickets,
		data: order.tickets,
		worker: order.worker,
	};
	const [data, setData] = useState(defaultOrder);
	const [clearSelectedRows, setClearSelectedRows] = useState(false);

	const toast = useToast();

	const {
		isOpen: isDelegateOpen,
		onOpen: onDelegateOpen,
		onClose: onDelegateClose,
	} = useDisclosure();
	const {
		isOpen: isChangeTeamOpen,
		onOpen: onChangeTeamOpen,
		onClose: onChangeTeamClose,
	} = useDisclosure();
	const {
		isOpen: isChangeGeoOpen,
		onOpen: onChangeGeoOpen,
		onClose: onChangeGeoClose,
	} = useDisclosure();
	const {
		isOpen: isDeleteOpen,
		onOpen: onDeleteOpen,
		onClose: onDeleteClose,
	} = useDisclosure();

	function handleRowSelected(state) {
		selectedRows = state.selectedRows;

		let selectedOK =
			!selectedRows.some((ticket) => ticket.Team == null) &&
			!selectedRows.some(
				(ticket) =>
					ticket.ticket_status == "COORDINADO" ||
					ticket.ticket_status == "RESUELTO"
			);
		let eraseOK = selectedRows.every(
			(ticket) => ticket.ticket_status != "RESUELTO"
		);

		if (state.selectedRows.length > 0) {
			if (!toastIdRef.current) {
				toastIdRef.current = toast({
					duration: null,
					position: "top",
					render: () => (
						<TableActions
							selectedRows={selectedRows}
							selectedOK={selectedOK}
							eraseOK={eraseOK}
							handleDelegateTickets={() => handleDelegateTickets()}
							handleChangeTeam={() => handleChangeTeam()}
							handleChangeGeo={() => handleChangeGeo()}
							handleDeleteTickets={() => handleDeleteTickets()}
						/>
					),
				});
			} else {
				toast.update(toastIdRef.current, {
					duration: null,
					position: "top",
					render: () => (
						<TableActions
							selectedRows={selectedRows}
							selectedOK={selectedOK}
							eraseOK={eraseOK}
							handleDelegateTickets={() => handleDelegateTickets()}
							handleChangeTeam={() => handleChangeTeam()}
							handleChangeGeo={() => handleChangeGeo()}
							handleDeleteTickets={() => handleDeleteTickets()}
						/>
					),
				});
			}
		} else {
			toast.close(toastIdRef.current);
			toastIdRef.current = null;
			selectedRows = [];
		}
	}

	const handleDelegateTickets = () => {
		toast.close(toastIdRef.current);

		onDelegateOpen();
	};

	function handleChangeTeam() {
		toast.close(toastIdRef.current);

		onChangeTeamOpen();
	}

	function handleChangeGeo() {
		toast.close(toastIdRef.current);

		onChangeGeoOpen();
	}

	function handleDeleteTickets() {
		// * Solo elimina los eventos de la orden (no los modifica en mesa)
		toast.close(toastIdRef.current);

		onDeleteOpen();
	}

	function handleOnDelegateCloseModal() {
		toast.close(toastIdRef.current);
		toastIdRef.current = null;
		onDelegateClose();
	}

	function handleOnChangeTeamCloseModal() {
		toast.close(toastIdRef.current);
		toastIdRef.current = null;
		onChangeTeamClose();
	}

	function handleOnChangeGeoCloseModal() {
		toast.close(toastIdRef.current);
		toastIdRef.current = null;
		onChangeGeoClose();
	}

	function handleOnDeleteCloseModal() {
		toast.close(toastIdRef.current);
		toastIdRef.current = null;
		onDeleteClose();
	}

	const handleClearSelectedRows = (value) => {
		toast.close(toastIdRef.current);
		toastIdRef.current = null;
		setClearSelectedRows(value);
	};

	return (
		<AccordionItem>
			<h2>
				<AccordionButton
					_expanded={{ bg: "#319795", color: "white" }}
					my={2}
					onClick={() => handleClearSelectedRows(!clearSelectedRows)}
				>
					<Box as="span" flex="1" fontSize="15" textAlign="left" pl={2}>
						{data.worker.name} ({data.auxData.length} tickets)
					</Box>
					<IoIosArrowDropdown size={20} />
				</AccordionButton>
			</h2>
			<AccordionPanel pb={4}>
				<Table
					auxData={data.auxData}
					data={data.data}
					isLoading={false}
					onDataFiltered={(newData) => setData({ ...data, data: newData })}
					handleRowSelected={(state) => handleRowSelected(state)}
					selectable={true}
					columns={columns}
					clearSelectedRows={clearSelectedRows}
				/>

				<DelegateModal
					isOpen={isDelegateOpen}
					onClose={() => handleOnDelegateCloseModal()}
					clearSelectedRows={(value) => handleClearSelectedRows(value)}
				/>
				<ChangeTeamModal
					isOpen={isChangeTeamOpen}
					onClose={() => handleOnChangeTeamCloseModal()}
					clearSelectedRows={(value) => handleClearSelectedRows(value)}
				/>
				<ChangeGeoModal
					isOpen={isChangeGeoOpen}
					onClose={() => handleOnChangeGeoCloseModal()}
					clearSelectedRows={(value) => handleClearSelectedRows(value)}
				/>
				<DeleteModal
					isOpen={isDeleteOpen}
					onClose={() => handleOnDeleteCloseModal()}
					clearSelectedRows={(value) => handleClearSelectedRows(value)}
				/>
			</AccordionPanel>
		</AccordionItem>
	);
};

const TableActions = ({
	selectedRows,
	selectedOK,
	eraseOK,
	handleDelegateTickets,
	handleChangeTeam,
	handleChangeGeo,
	handleDeleteTickets,
}) => {
	return (
		<Flex flexDirection={"column"}>
			{selectedOK ? (
				<Box
					bg={"blue.500"}
					p={3}
					borderRadius={10}
					mt={3}
					color={"white"}
					cursor={"pointer"}
					_hover={{ backgroundColor: "blue.600" }}
					style={{
						transition: "all .2s",
						boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.24)",
					}}
					onClick={() => handleDelegateTickets()}
				>
					<InfoOutlineIcon mr={3} />
					{`Delegar ${selectedRows.length} ticket`}
				</Box>
			) : (
				<Box
					bg={"red.500"}
					p={3}
					borderRadius={10}
					mt={3}
					color={"white"}
					cursor={"pointer"}
					_hover={{ backgroundColor: "red.600" }}
					style={{
						transition: "all .2s",
						boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.24)",
					}}
				>
					<Flex dir="column">
						<InfoOutlineIcon mr={3} />
						<Text>
							Los ticket a delegar no pueden tener estado COORDINADO o RESUELTO.
							Además deben tener asignada una cuadrilla y geo del cliente. Si se
							actualiza la geo ya se configura la cuadrilla correspondiente.
						</Text>
					</Flex>
				</Box>
			)}
			{selectedRows.length == 1 && (
				<Box
					bg={"purple.500"}
					p={3}
					borderRadius={10}
					mt={3}
					color={"white"}
					cursor={"pointer"}
					_hover={{ backgroundColor: "purple.600" }}
					style={{
						transition: "all .2s",
						boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.24)",
					}}
					onClick={() => handleChangeTeam()}
				>
					<InfoOutlineIcon mr={3} />
					{`Cambiar de equipo el ticket seleccionado`}
				</Box>
			)}
			{selectedRows.length == 1 && (
				<Box
					bg={"gray.500"}
					p={3}
					borderRadius={10}
					mt={3}
					color={"white"}
					cursor={"pointer"}
					_hover={{ backgroundColor: "gray.600" }}
					style={{
						transition: "all .2s",
						boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.24)",
					}}
					onClick={() => handleChangeGeo()}
				>
					<InfoOutlineIcon mr={3} />
					{`Cambiar geo del ticket seleccionado`}
				</Box>
			)}
			{eraseOK && (
				<Box
					bg={"red.500"}
					p={3}
					borderRadius={10}
					mt={3}
					color={"white"}
					cursor={"pointer"}
					_hover={{ backgroundColor: "red.600" }}
					style={{
						transition: "all .2s",
						boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.24)",
					}}
					onClick={() => handleDeleteTickets()}
				>
					<InfoOutlineIcon mr={3} />
					{`Cerrar ${selectedRows.length} ticket`}
				</Box>
			)}
		</Flex>
	);
};

const DelegateModal = ({ isOpen, onClose, clearSelectedRows }) => {
	const [coordinatorsOptions, setCoordinatorsOptions] = useState([]);
	const [supervisorOptions, setSupervisorOptions] = useState([]);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const alertDefault = {
		status: "info",
		message: "Seleccionar un coordinador o supervisor para delegar",
	};
	const [alert, setAlert] = useState(alertDefault);

	const { control, handleSubmit } = useForm();
	const toast = useToast();
	const toastIdRefError = useRef();
	const contextFetchTk = useContext(ContextFetchTkFromDB);

	const closeErrorToast = () => {
		toast.close(toastIdRefError.current);
		toastIdRefError.current = null;
	};

	const onSubmit = (data) => {
		const { workerId, supervisorId } = data;

		if (workerId && supervisorId) {
			setAlert({
				status: "error",
				message:
					"No puede seleccionar un coordinador y supervisor al mismo tiempo",
			});
		} else if (workerId || supervisorId) {
			setLoadingSubmit(true);

			let worker = workerId ? workerId : supervisorId;

			axios
				.post("/api/supervisor/delegateTickets", {
					workerId: worker.value,
					tickets: selectedRows,
				})
				.then((res) => {
					clearSelectedRows(true);

					const { status, data } = res;

					if (status == 206) {
						toastIdRefError.current = toast({
							duration: null,
							position: "top-center",
							render: () => (
								<Flex
									alignItems={"center"}
									gap={"25px"}
									flexDir={"row"}
									p={3}
									borderRadius={10}
									borderColor={"red.500"}
									borderWidth={3}
									bg={"red.100"}
									shadow={"xl"}
									fontSize={"15px"}
								>
									<Box>
										<Text fontWeight={"bold"}>{data.message}</Text>
										<List spacing={3}>
											{data.ticketsFail.map((ticket, i) => (
												<ListItem
													key={i}
													display={"flex"}
													alignItems={"center"}
												>
													<ListIcon as={FaTimesCircle} color={"red.500"} />{" "}
													{ticket.message}
												</ListItem>
											))}
										</List>
									</Box>
									<Box style={{ cursor: "pointer" }} onClick={closeErrorToast}>
										<FaTimes color="rgb(102, 0, 0)" />
									</Box>
								</Flex>
							),
						});
					} else {
						toastSuccess("Se delegaron los tickets con exito!");
						contextFetchTk.setFetchFromDB(new Date());
						onClose();
					}
				})
				.catch((err) => {
					//console.log(err);
					toastError(
						err.response?.data?.message ||
							"Ha ocurrido un error al intentar delegar los tickets."
					);
				})
				.finally((value) => setLoadingSubmit(false));
		} else {
			setAlert({
				status: "error",
				message: "Se debe seleccionar un coordinador o un supervisor",
			});
		}
	};

	useEffect(() => {
		if (isOpen) {
			axios
				.get("/api/supervisor/getMyWorkers")
				.then((res) => {
					setCoordinatorsOptions(
						res.data.workers.map((worker, i) => {
							return {
								minHeight: 35,
								label: (
									<Flex key={i} flexDir={"row"} alignItems={"center"} gap={3}>
										<Icon
											as={
												worker.name.toLowerCase().includes("whatsapp")
													? IoLogoWhatsapp
													: IoMdPerson
											}
											color={
												worker.name.toLowerCase().includes("whatsapp")
													? "#2AD348"
													: "#285E61"
											}
											size={"22px"}
											key={i}
										/>
										{worker.name}
									</Flex>
								),
								value: worker.id,
							};
						})
					);

					setSupervisorOptions(
						res.data.supervisors.map((worker, i) => {
							return {
								label: (
									<Flex key={i} flexDir={"row"} alignItems={"center"} gap={3}>
										<Icon
											as={
												worker.name.toLowerCase().includes("whatsapp")
													? IoLogoWhatsapp
													: IoMdPerson
											}
											color={
												worker.name.toLowerCase().includes("whatsapp")
													? "#2AD348"
													: "#285E61"
											}
											size={"22px"}
											key={i}
										/>
										{worker.name}
									</Flex>
								),
								value: worker.id,
							};
						})
					);
				})
				.catch((err) => console.error(err));
		}
	}, [isOpen]);

	// Custom styles para el select de coordinadores y supervisores
	const customSelectStyles = {
		control: (base) => ({
			...base,
			height: 40,
			minHeight: 35,
			fontSize: "14px",
		}),
		option: (provided, state) => ({
			...provided,
			fontSize: "14px",
		}),
		placeholder: (base) => ({
			...base,
			fontSize: "14px",
		}),
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Delegar tickets</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl>
							<FormLabel>Coordinador</FormLabel>
							<Controller
								control={control}
								name="workerId"
								/* rules={{ required: true, }} */
								render={({ field }) => (
									<Select
										{...field}
										autoFocus={true}
										isSearchable={true}
										options={coordinatorsOptions}
										styles={customSelectStyles}
										placeholder={"Seleccionar..."}
									/>
								)}
							/>
							<FormLabel mt={3}>Supervisor</FormLabel>
							<Controller
								control={control}
								name="supervisorId"
								/* rules={{ required: true, }} */
								render={({ field }) => (
									<Select
										{...field}
										autoFocus={true}
										isSearchable={true}
										options={supervisorOptions}
										styles={customSelectStyles}
										placeholder={"Seleccionar..."}
									/>
								)}
							/>
						</FormControl>
						<Alert status={alert.status} py={1} mt={2}>
							<AlertIcon />
							<AlertTitle fontWeight={"medium"} fontSize={"13px"}>
								{" "}
								{alert.message}{" "}
							</AlertTitle>
						</Alert>
						<Flex mt={5} justifyContent={"flex-end"}>
							<Button
								fontWeight={"normal"}
								onClick={() => {
									onClose();
									setAlert(alertDefault);
								}}
								mr={3}
								isDisabled={loadingSubmit}
							>
								Cancelar
							</Button>
							<Button
								fontWeight={"normal"}
								colorScheme="blue"
								type="submit"
								isLoading={loadingSubmit}
								loadingText={"Delegando tickets..."}
							>
								Delegar
							</Button>
						</Flex>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

const ChangeTeamModal = ({ isOpen, onClose, clearSelectedRows }) => {
	const [teamOptions, setTeamOptions] = useState([]);
	const [loadingSubmit, setLoadingSubmit] = useState(false);

	const contextFetchTk = useContext(ContextFetchTkFromDB);

	const { control, handleSubmit } = useForm();

	const onSubmit = (data) => {
		setLoadingSubmit(true);
		const { teamId } = data;

		axios
			.post(`/api/team/changeTeam?ticket_id=${selectedRows[0].id}`, {
				team_id: teamId.value,
			})
			.then((res) => {
				clearSelectedRows(true);
				onClose();

				toastSuccess("Se actualizo el equipo con exito!");
				contextFetchTk.setFetchFromDB(new Date());
			})
			.catch((err) => {
				toastError("Ha ocurrido un error al intentar cambiar el equipo.");
			})
			.finally((value) => setLoadingSubmit(false));
	};

	useEffect(() => {
		if (isOpen) {
			axios
				.get("/api/supervisor/getMyTeams")
				.then((res) => {
					setTeamOptions(
						res.data.map((team) => {
							return {
								label: team.name,
								value: team.id,
							};
						})
					);
				})
				.catch((err) => console.error(err));
		}
	}, [isOpen]);

	// Custom styles para el select de equipos
	const customSelectStyles = {
		control: (base) => ({
			...base,
			height: 40,
			minHeight: 35,
			fontSize: "14px",
		}),
		option: (provided, state) => ({
			...provided,
			fontSize: "14px",
		}),
		placeholder: (base) => ({
			...base,
			fontSize: "14px",
		}),
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Cambiar Equipo</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl>
							<FormLabel>Equipo</FormLabel>
							<Controller
								control={control}
								name="teamId"
								rules={{ required: true }}
								render={({ field }) => (
									<Select
										{...field}
										autoFocus={true}
										isSearchable={true}
										options={teamOptions}
										styles={customSelectStyles}
										placeholder={"Seleccionar..."}
									/>
								)}
							/>
						</FormControl>
						<Flex mt={5} justifyContent={"flex-end"}>
							<Button
								fontWeight={"normal"}
								onClick={() => {
									onClose();
								}}
								mr={3}
								isDisabled={loadingSubmit}
							>
								Cancelar
							</Button>
							<Button
								fontWeight={"normal"}
								colorScheme="blue"
								type="submit"
								isLoading={loadingSubmit}
								loadingText={"Cambiando equipo..."}
							>
								Actualizar
							</Button>
						</Flex>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

const ChangeGeoModal = ({ isOpen, onClose, clearSelectedRows }) => {
	const [coordinates, setCoordinates] = useState();
	const [warning, setWarning] = useState(null);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [disableUpdate, setDisableUpdate] = useState(true);
	const focusInput = useRef();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		coordinates: "",
	});

	const contextFetchTk = useContext(ContextFetchTkFromDB);

	const onSubmit = (data) => {
		setLoadingSubmit(true);

		if (!coordinates) {
			toastError("Error al guardar datos ingresados.");

			return false;
		}

		let test_coordinates = convertirCoordenadas(coordinates);

		if (!test_coordinates) {
			setWarning(
				"Las coordenadas ingresadas o el link de google maps no es válido."
			);
		}

		data.ticket = selectedRows[0];
		data.coordinates = test_coordinates;
		data.update_order = true;

		//console.log(data);

		axios
			.post("/api/supervisor/changeGeo", data)
			.then((res) => {
				//console.log(res.data);

				clearSelectedRows(true);
				setWarning(null);
				setDisableUpdate(true);
				onClose();

				toastSuccess("Se actualizo la geo con exito!");
				contextFetchTk.setFetchFromDB(new Date());
			})
			.catch((err) => {
				toastError("Ha ocurrido un error al intentar cambiar la geo.");
			})
			.finally((value) => setLoadingSubmit(false));
	};

	useEffect(() => {
		if (coordinates) {
			setDisableUpdate(false);
		}
	}, [coordinates]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				setWarning(null);
				onClose();
			}}
			size={"lg"}
			isCentered
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Cambiar Geo del Cliente</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl>
							<Box>
								<Text mb={3} fontSize={16} fontWeight="bold">
									{" "}
									Coordenadas{" "}
								</Text>
								<Input
									placeholder="-32.853298,-68.690438"
									size="md"
									w="100%"
									ref={focusInput}
									onChange={(e) => setCoordinates(e.target.value)}
								/>
							</Box>

							{warning && (
								<Alert fontSize={14} my={4} py={2} status="error">
									<AlertIcon boxSize="15px" /> {warning}
								</Alert>
							)}
						</FormControl>

						<Alert flexDirection="column" fontSize={14} py={2} my={3}>
							<Flex
								flexDirection="row"
								alignItems="center"
								justifyContent="center"
							>
								<AlertIcon />
								<AlertTitle mt={2} mb={1} fontSize="md">
									Información importante!
								</AlertTitle>
							</Flex>
							<AlertDescription maxWidth="sm">
								<UnorderedList>
									<ListItem>
										Asegurese que sea correcta la ubicación del cliente antes de
										cambiarla
									</ListItem>
									<ListItem>
										Al actualizar, el ticket sera delegado automáticamente al
										supervisor correspondiente
									</ListItem>
									<ListItem>
										Se recomienda utilizar el{" "}
										<Link
											href="https://geodex.westnet.com.ar/"
											color="red.500"
											isExternal
										>
											MAPA
										</Link>{" "}
										para ubicar la geo del cliente y verificar cluster
									</ListItem>
								</UnorderedList>
							</AlertDescription>
						</Alert>

						<Flex mt={5} justifyContent={"flex-end"}>
							<Button
								fontWeight={"normal"}
								onClick={() => {
									onClose();
								}}
								mr={3}
								isDisabled={loadingSubmit}
							>
								Cancelar
							</Button>
							<Button
								fontWeight={"normal"}
								isDisabled={disableUpdate}
								colorScheme="teal"
								type="submit"
								isLoading={loadingSubmit}
								loadingText={"Cambiando geo..."}
							>
								Actualizar
							</Button>
						</Flex>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

const DeleteModal = ({ isOpen, onClose, clearSelectedRows }) => {
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [commentMesa, setCommentMesa] = useState(null);
	const [alert, setAlert] = useState(false);

	const contextFetchTk = useContext(ContextFetchTkFromDB);

	const { control, handleSubmit } = useForm();

	const onSubmit = () => {
		setLoadingSubmit(true);
		let data = {
			ticket_status: "CERRADO",
			tickets: selectedRows,
			closeInMesa: isChecked,
			comment: commentMesa,
		};

		if (isChecked && !commentMesa) {
			setAlert(true);
			setLoadingSubmit(false);
			return false;
		}

		axios
			.patch("/api/supervisor/changeStatusTickets", data)
			.then((res) => {
				clearSelectedRows(true);
				onClose();

				toastSuccess("Los tickets se marcaron como cerrados con éxito!");
				contextFetchTk.setFetchFromDB(new Date());
			})
			.catch((err) => {
				toastError(
					"Ha ocurrido un error al intentar cambiar el estado de los tickets."
				);
			})
			.finally((value) => {
				setLoadingSubmit(false);
				setAlert(false);
				setIsChecked(false);
			});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				setAlert(false);
				setIsChecked(false);
				onClose();
			}}
			size={"lg"}
			isCentered
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Cerrar Ticket</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Alert
							status="warning"
							mb={5}
							px={4}
							py={2}
							fontSize={14}
							flexDirection="column"
						>
							<AlertIcon boxSize="30px" my={2} />
							<AlertDescription>
								<UnorderedList>
									<ListItem>
										Realizar solo en caso de que los tickets hayan sido
										trabajados por Mesa o el cliente no desee la visita técnica.
									</ListItem>
									<ListItem>
										Se pasara el estado de los tickets a CERRADO en Do+, esto
										significa que el técnico no trabajo en el domicilio.
									</ListItem>
									<ListItem>
										Si desea actualizar en Mesa los tickets se cerraran como
										"cerrado (resuelto)".
									</ListItem>
								</UnorderedList>
							</AlertDescription>
						</Alert>

						<Checkbox onChange={(e) => setIsChecked(e.target.checked)}>
							<Text fontSize={14}> Cerrar ticket en Mesa </Text>
						</Checkbox>
						{isChecked && (
							<Textarea
								placeholder="Motivo de cierre"
								size="sm"
								mt={3}
								onChange={(e) => setCommentMesa(e.target.value)}
							/>
						)}
						{alert && (
							<Alert status="error" px={4} py={2} fontSize={14}>
								<AlertIcon />
								<AlertDescription>
									<Text>
										{" "}
										Debe incluir un comentario para dejar en el/los ticket/s de
										Mesa{" "}
									</Text>
								</AlertDescription>
							</Alert>
						)}

						<Flex mt={5} justifyContent={"flex-end"}>
							<Button
								fontWeight={"normal"}
								colorScheme="blue"
								onClick={() => {
									setAlert(false);
									setIsChecked(false);
									onClose();
								}}
								mr={3}
								isDisabled={loadingSubmit}
							>
								Cancelar
							</Button>
							<Button
								fontWeight={"normal"}
								colorScheme="red"
								type="submit"
								isLoading={loadingSubmit}
								loadingText={"Cerrando..."}
							>
								Actualizar
							</Button>
						</Flex>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default Index;
