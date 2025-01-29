
module.exports = class  {
    constructor(query, QueryString) {
      this.query = query;
      this.queryString = QueryString;
    }
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFiled = ["page", "sort", "limit", "fields"];
      excludedFiled.forEach((field) => delete queryObj[field]);
  
      // 2 advanced filtering
      let QueryString = JSON.stringify(queryObj);
      QueryString = QueryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedWOrd) => `$${matchedWOrd}`,
      );
  
      this.query = this.query.find(JSON.parse(QueryString)); // each function tack a query and return  a new query object after adding the features
      return this;
    }
    sorting() {
      // 3) sorting
      if (this.queryString.sort) {
        let sortByString = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortByString);
      } else {
        this.query = this.query.sort("-createdAt");
      }
      return this;
    }
    limitingFields() {
      // 4) limiting fields
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v");
      }
      return this;
    }
    pagination() {
      // 5) pagination
      let defaultPage = this.queryString.page * 1 || 1;
      let defaultLimit = this.queryString.limit * 1 || 100;
      const NoOfskipedDucomment = (defaultPage - 1) * defaultLimit;
      this.query = this.query.skip(NoOfskipedDucomment).limit(defaultLimit);
      return this;
    }
  }
  