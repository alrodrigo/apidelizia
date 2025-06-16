const Empleado = require('../models/Empleado');
// @desc: Obtener todos los empleados
// @route: GET /api/v1/empleados
// @access: Private (Admin)
exports.getEmpleados = async (req, res) => {
    try {
        //Permitir filtrado
        let query;
        //copiar req.query
        const reqQuery = { ...req.query };
        
        // Manejar búsqueda por nombre
        if (reqQuery.nombre) {
            reqQuery.$or = [
                { nombre: { $regex: reqQuery.nombre, $options: 'i' } },
                { apellido: { $regex: reqQuery.nombre, $options: 'i' } }
            ];
            delete reqQuery.nombre;
        }
        
        //Campos a excluir
        const removeFields = ['select', 'sort', 'page', 'limit'];
        //Eliminar los campos de reqQuery
        removeFields.forEach(param => delete reqQuery[param]);
        //Convertir a string
        let queryStr = JSON.stringify(reqQuery);
        //Reemplazar operadores de MongoDB
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        const filters = JSON.parse(queryStr);
        
        // encontrar empleados
        query = Empleado.find(filters).populate('agencia');
        //Seleccionar campos
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        //Sort 
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }
        //Paginación
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Empleado.countDocuments(filters);
        query = query.skip(startIndex).limit(limit);
        //Ejecutar la consulta
        const empleados = await query;
        //Paginación de resultados
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
        res.status(200).json({
            success: true,
            count: total,
            pagination,
            data: empleados
        })   
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al obtener los empleados'
        });
    }
}

// @desc: Obtener un empleado por ID
// @route: GET /api/empleados/:id
// @access: Private
exports.getEmpleado = async (req, res) => {
    try {
        const empleado = await Empleado.findById(req.params.id).populate('agencia');
        if (!empleado) {
            return res.status(404).json({
                success: false,
                message: `Empleado no encontrado con id ${req.params.id}`
            });
        }
        
        res.status(200).json({
            success: true,
            data: empleado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al obtener el empleado'
        });
    }
}

// @desc: Crear un nuevo empleado
// @route: POST /api/empleados
// @access: Private (Admin)
exports.createEmpleado = async (req, res) => {
    try {
        const empleado = await Empleado.create(req.body);
        
        res.status(201).json({
            success: true,
            data: empleado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al crear el empleado'
        });
    }
}

// @desc: Actualizar un empleado
// @route: PUT /api/empleados/:id
// @access: Private (Admin)
exports.updateEmpleado = async (req, res) => {
    try {
        let empleado = await Empleado.findById(req.params.id);
        
        if (!empleado) {
            return res.status(404).json({
                success: false,
                message: `Empleado no encontrado con id ${req.params.id}`
            });
        }
        
        empleado = await Empleado.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            data: empleado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al actualizar el empleado'
        });
    }
}

// @desc: Eliminar un empleado por ID
// @route: DELETE /api/empleados/:id
// @access: Private (Admin)
exports.deleteEmpleado = async (req, res) => {
    try {
        const empleado = await Empleado.findById(req.params.id);
        if (!empleado) {
            return res.status(404).json({
                success: false,
                message: `Empleado no encontrado con id ${req.params.id}`
            });
        }
        
        await empleado.deleteOne(); // En versiones más recientes de Mongoose se usa deleteOne en lugar de remove
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al eliminar el empleado'
        });
    }
}