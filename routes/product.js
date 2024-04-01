import { Router } from 'express';
import productController from '../controller/product.js';

const routes = new Router();

routes.get('/', productController.allProducts);
routes.get('/admin/products', productController.adminProducts);

routes.get('/:id', productController.detailProduct);
routes.post('/new', productController.createProduct);
routes.post('/newReview', productController.createReview);
routes.delete('/:id', productController.deleteProduct);
routes.put('/:id', productController.updateProduct);

export default routes;
