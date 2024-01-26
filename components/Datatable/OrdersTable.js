import DataTable from 'react-data-table-component';
import { Input, Text } from "@chakra-ui/react"


const Table = ({ auxData, data, isLoading, onDataFiltered, handleRowSelected, selectable = false, columns, clearSelectedRows = false }) => {

    return (
        <>
            {
                data && !isLoading && <TableFilter data={auxData} onDataFiltered={(newData) => onDataFiltered(newData)} />
            }
            <DataTable
                columns={columns}
                data={data}
                noDataComponent={<Text fontWeight={'normal'} padding={5}>No hay tickets</Text>}
                pagination
                paginationComponentOptions={{
                    selectAllRowsItem: true,
                    selectAllRowsItemText: 'Todos',
                    rangeSeparatorText: 'de',
                    rowsPerPageText: 'Tickets por página'
                }}
                fixedHeader
                onSelectedRowsChange={(state) => handleRowSelected(state)}
                progressPending={isLoading}
                progressComponent={<Text size="16px" fontWeight={'bold'} padding={5}>Cargando...</Text>}
                theme='solarized'
                customStyles={{
                    headCells: {
                        style: {
                            justifyContent: 'center',
                            color: '#000000',
                            fontSize: '14px',
                            fontWeight: 'medium',
                        },
                    },
                    cells: {
                        style: {
                            justifyContent: 'center',
                            fontSize: '13px',            
                        },
                    },
                    pagination: {
                        style: {
                            color: '#006666'
                        },
                        pageButtonsStyle: {
                            backgroundColor: '#F4F7FE',
                            '&:focus': {
                                backgroundColor: '#E6E9EF',
                            },
                            '&:hover:not(:disabled)': {
                                backgroundColor: '#E6E9EF',
                            },
                        }
                    }
                }}
                selectableRows={selectable}
                clearSelectedRows={clearSelectedRows}
            />
        </>

    )
}

const TableFilter = ({ data, onDataFiltered }) => {

    function handleSearch (value) {
        let newData = data.filter(ticket =>
            ticket.id.toString().includes(value) ||
            ticket.ticket_created_at.includes(value) ||
            ticket.ticket_category.toUpperCase().includes(value) ||
            ticket.ticket_status.toUpperCase().includes(value) ||
            ticket.Team.name.includes(value)
        )

        onDataFiltered(newData);

    }

    return (
        <Input autoFocus={true} mb={3} placeholder="Buscar palabra" onChange={(e) => handleSearch(e.currentTarget.value.toUpperCase())} />
    )

}


export default Table;