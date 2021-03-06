import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import articles from '../content/articles';

import ArticlesList from '../components/ArticlesList';
import CommentsList from '../components/CommentsList';
import UpvotesSections from '../components/UpvotesSections';
import CommentForm from '../components/CommentForm';

import fetchData from '../utils/fetchData';

import NotFoundPage from './NotFoundPage';

const defaultState = {
  upvotes: 0,
  comments: []
};

const ArticlePage = () => {
  const { name } = useParams();

  const article = articles.find(article => article.name === name);
  const relatedArticles = articles.filter(article => article.name !== name);

  const [articleInfo, setArticleInfo] = useState(defaultState);
  useEffect(() => {
    fetchData(`/api/articles/${name}`, ({ upvotes, comments }) => setArticleInfo({
      upvotes,
      comments
    }));
  }, [name]);

  if (!article) return <NotFoundPage />

  const getParagraph = (paragraph, key) => <p key={key}>{paragraph}</p>;
  const getContent = (content) => content.map(getParagraph);

  return (
    <>
      <h1>{article.title}</h1>
      <UpvotesSections
        name={name}
        upvotes={articleInfo.upvotes}
        fetchData={fetchData}
        stateHandler={setArticleInfo}
      />
      {getContent(article.content)}
      <CommentForm name={name} fetchData={fetchData} stateHandler={setArticleInfo} />
      <CommentsList comments={articleInfo.comments} />
      <ArticlesList articles={relatedArticles} />
    </>
  )
};

export default ArticlePage;
