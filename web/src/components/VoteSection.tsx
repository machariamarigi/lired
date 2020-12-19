import React, { useState } from 'react'
import { Flex, IconButton } from '@chakra-ui/core';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface VoteSectionProps {
    post: PostSnippetFragment
}

const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
    const [, vote] = useVoteMutation()
    const [loadingState, setLoadingState] = useState<
        "upvote-loading" | "downvote-loading" | "not-loading">("not-loading")
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
                variant={post.voteStatus === 1 ? undefined : 'outline'}
                colorScheme="green"
                onClick={async () => {
                    if (post.voteStatus === 1) {
                        return
                    }
                    setLoadingState("upvote-loading")
                    await vote({
                        postId: post.id,
                        value: 1
                    })
                    setLoadingState("not-loading")
                }}
                isLoading={loadingState==="upvote-loading"}
            />
            { post.points }
            <IconButton
                icon={<ChevronDownIcon />}
                aria-label="vote -1"
                size="sm"
                variant={post.voteStatus === -1 ? undefined : 'outline'}
                colorScheme="red"
                onClick={async () => {
                    if (post.voteStatus === -1) {
                        return
                    }
                    setLoadingState("downvote-loading")
                    await vote({
                        postId: post.id,
                        value: -1
                    })
                    setLoadingState("not-loading")
                }}
                isLoading={loadingState==="downvote-loading"}
            />
        </Flex>
    );
}

export default VoteSection
