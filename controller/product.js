import { v2 as cloudinary } from 'cloudinary';

import Product from '../db/models/product.js';

import Response from '../lib/Response.js';
import CustomError from '../lib/Error.js';
import { HTTP_CODES } from '../config/Enum.js';
import ProductFilter from '../utils/productFilter.js';
class ProductController {
  //! list of products
  async allProducts(req, res) {
    try {
      const resultPerPage = 10;
      const productFilter = new ProductFilter(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
      const products = await productFilter.query;
      res.status(HTTP_CODES.OK).json(Response.successResponse(products));
    } catch (error) {
      let errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
  async detailProduct(req, res) {
    try {
      const body = req.body;
      const product = await Product.findById(body.params.id);

      res.status(HTTP_CODES.OK).json(Response.successResponse(product));
    } catch (error) {
      let errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
  //admin
  //! create product
  async createProduct(req, res) {
    try {
      const body = req.body;
      let images = [];
      if (typeof body.images === 'string') {
        images.push(body.images);
      } else {
        images = body.images;
      }
      let allImage = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
          folder: 'products',
        });
        allImage.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      body.images = allImage;
      const product = await Product.create(body);
      res
        .status(HTTP_CODES.CREATED)
        .json(
          Response.successResponse(
            product,
            'create success',
            HTTP_CODES.CREATED
          )
        );
    } catch (error) {
      let errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
  // hataya aık düzenle
  async deleteProduct(req, res) {
    try {
      const body = req.body;
      const product = await Product.findById(body.params.id);
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id, {
          folder: 'products',
        });
      }
      await product.delete();
      res
        .status(HTTP_CODES.OK)
        .json(Response.successResponse('delete success'));
    } catch (error) {
      let errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
  async updateProduct(req, res) {
    try {
      const body = req.body;
      //!
      let images = [];
      if (typeof body.images === 'string') {
        images.push(body.images);
      } else {
        images = body.images;
      }
      if (images !== undefined) {
        for (let i = 0; i < product.images.length; i++) {
          await cloudinary.uploader.destroy(product.images[i].public_id, {
            folder: 'products',
          });
        }
      }
      let allImage = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
          folder: 'products',
        });
        allImage.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      body.images = allImage;
      //!
      const product = await Product.findByIdAndUpdate(
        body.params.id,
        body.body,
        { new: true, runValidators: true }
      );
      res
        .status(HTTP_CODES.OK)
        .json(
          Response.successResponse(product, 'update success', HTTP_CODES.OK)
        );
    } catch (error) {
      let errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
  async createReview(req, res, next) {
    try {
      const { productId, comment, rating } = req.body;
      const review = {
        user: req.user._id,
        name: req.user.name,
        comment,
        rating: Number(rating),
      };
      const product = await Product.findById(productId);
      product.reviews.push(review);
      let avg = 0;
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      product.rating = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });
      res
        .status(HTTP_CODES.OK)
        .json(Response.successResponse(product, 'added review success'));
    } catch (error) {
      let errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }

  async adminProducts(req, res) {
    try {
      const product = await Product.find();
      res.status(HTTP_CODES.OK).json(Response.successResponse(product));
    } catch (error) {
      let errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
  // async form(req, res) {
  //   try {
  //   } catch (error) {
  //     let errorResponse = Response.errorResponse(error);
  //     res.status(errorResponse.code).json(errorResponse);
  //   }
  // }
}

export default new ProductController();
