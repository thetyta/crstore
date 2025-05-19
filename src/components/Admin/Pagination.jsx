import { 
    Pagination, 
    ButtonGroup, 
    IconButton 
} from "@chakra-ui/react"
import { 
    MdKeyboardArrowRight, 
    MdKeyboardArrowLeft 
} from 'react-icons/md';

export default function PaginationDoida ({
    items,
    itemsPerPage,
    currentPage,
    setCurrentPage,
}) {
    return (
        <Pagination.Root
            count={items.length}
            pageSize={itemsPerPage}
            defaultPage={1}
            page={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
        >
            <ButtonGroup variant="ghost" size="xs">
                <Pagination.PrevTrigger asChild>
                <IconButton
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                >
                    <MdKeyboardArrowLeft />
                </IconButton>
                </Pagination.PrevTrigger>
                <Pagination.Items
                render={(page) => (
                    <IconButton
                    onClick={() => setCurrentPage(page.value)}
                    variant={{ base: 'ghost', _selected: 'outline' }}
                    >
                    {page.value}
                    </IconButton>
                )}
                />
                <Pagination.NextTrigger asChild>
                <IconButton
                    onClick={() =>
                    setCurrentPage(
                        Math.min(
                        currentPage + 1,
                        Math.ceil(tasksFiltradas.length / itemsPerPage)
                        )
                    )
                    }
                >
                    <MdKeyboardArrowRight />
                </IconButton>
                </Pagination.NextTrigger>
            </ButtonGroup>
        </Pagination.Root>
    )
}