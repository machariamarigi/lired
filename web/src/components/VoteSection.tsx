import { Flex, IconButton } from '@chakra-ui/core';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React from 'react'
import { PostSnippetFragment } from '../generated/graphql';

interface VoteSectionProps {
    post: PostSnippetFragment
}

const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
    return (
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            mr={4}
        >
            
            <IconButton
                icon={<ChevronUpIcon />}
                aria-label="vote +1"
                size="sm"
                variant="outline"
            />
            { post.points }
            <IconButton
                icon={<ChevronDownIcon />}
                aria-label="vote -1"
                size="sm"
                variant="outline"
            />
        </Flex>
    );
}

export default VoteSection
