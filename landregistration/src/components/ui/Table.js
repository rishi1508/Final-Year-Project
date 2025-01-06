import React from 'react';

const Table = ({ children }) => {
  return <table>{children}</table>;
};

const TableHeader = ({ children }) => {
  return <thead>{children}</thead>;
};

const TableRow = ({ children }) => {
  return <tr>{children}</tr>;
};

const TableHead = ({ children }) => {
  return <th>{children}</th>;
};

const TableBody = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const TableCell = ({ children }) => {
  return <td>{children}</td>;
};

export { Table, TableHeader, TableRow, TableHead, TableBody, TableCell };