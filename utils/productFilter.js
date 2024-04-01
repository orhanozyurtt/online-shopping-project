class ProductFilter {
  constructor(query, queryString) {
    this.query = query;
    this.queryStr = queryString;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = {
      ...this.queryStr,
    };
    const deleteArea = ['keyword', 'page', 'limit'];
    deleteArea.forEach((item) => {
      delete queryCopy[item];
    });
    this.query = this.query.find(queryCopy);
    const queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt||gte||lt||lte)\b/g, (key) => `${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  pagination(resultPerPage) {
    const activePAge = this.queryStr.page || 1;
    const skip = (activePAge - 1) * activePAge;
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
export default ProductFilter;
