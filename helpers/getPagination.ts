const getPagination = (page: number, size: number) => {
    const startAt = page > 1 ? (page-1)*size : 0;
  
    return { startAt };
};

export default getPagination;