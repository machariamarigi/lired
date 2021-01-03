import React from 'react';
import NextLink from "next/link"
import { Box, IconButton, Link } from '@chakra-ui/core';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
    id: number
    creatorId: number
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id, creatorId }) => {
    const [, deletePost] = useDeletePostMutation()
    const [{ data: dataMe }] = useMeQuery()

    return (
        <Box visibility={creatorId === dataMe?.me?.id ? 'visible' : 'hidden' }>
            <NextLink href="/post/edit/[id]" as={`post/edit/${id}`}>
                <IconButton
                    as={Link}
                    icon={<EditIcon />}
                    aria-label="Edit Post"
                    mr={4}
                    variant="outline"
                    colorScheme="blue"
                />                              
            </NextLink>

            <IconButton
                icon={<DeleteIcon />}
                aria-label="Delete Post"
                onClick={() => {
                    deletePost({ id })
                }}
                variant="outline"
                colorScheme="red"
            />
        </Box>
    );
}

export default EditDeletePostButtons
