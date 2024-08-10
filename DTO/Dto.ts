import Joi from "joi";


export class Dto {
    static userDto() {
        const schema = Joi.object({
// Suggested code may be subject to a license. Learn more: ~LicenseLog:87073855.
            phone: Joi.number().required(),
            password: Joi.string().required(),
            email: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            role: Joi.string().required(),
            id: Joi.number().optional(),
            isVisible: Joi.boolean().optional(),
            isActived: Joi.boolean().optional()
        });
        return schema;
    }

    static characteristicDto() {
        const schema = Joi.object({
            name: Joi.string().required(),
            value: Joi.string().required(),
            id: Joi.number().optional(),
            isVisible: Joi.boolean().optional(),
            isActived: Joi.boolean().optional()
        });

        return schema;
    }

    static categoryDto() {
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().optional(),
            imageUrl: Joi.string().required(),
            id: Joi.number().optional(),
            isVisible: Joi.boolean().optional(),
            isActived: Joi.boolean().optional()
        });

        return schema;
    }

    static productDto() {
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            imageUrl: Joi.array<string>().required(),
            price: Joi.number().required(),
            tax: Joi.number().optional(),
            categoryId: Joi.number().required(),
            id: Joi.number().optional(),
            isVisible: Joi.boolean().optional(),
            isActived: Joi.boolean().optional()
        });
        return schema;
    }

    static productCharacteristic() {
        const schema = Joi.object({
            id: Joi.number().optional(),
            productId: Joi.number().required(),
            characteristicId: Joi.number().required(),
        });
        return schema;
    }

    static  deliveryDto() {
        const schema = Joi.object({
            city: Joi.string().required(),
            quarter: Joi.string().required(),
            deliveryDate: Joi.string().required(),
            deliveryHoures: Joi.string().required(),
            codePromo: Joi.string().optional(),
            indiqueName: Joi.string().required(),
            indiqueNumber: Joi.number().required(),
            userId: Joi.number().required(),
            id: Joi.number().optional(),
            longitude: Joi.string().optional(),
            latitude: Joi.string().optional(),
            isVisible: Joi.boolean().optional(),
            isActived: Joi.boolean().optional(),
        });
        return schema;
    }

    static  orderDto() {
        const schema = Joi.object({
            totalPrice: Joi.number().required(),
            status: Joi.string().required(),
            payement: Joi.string().required(),
            amount: Joi.number().required(),
            deliveryId: Joi.number().required(),
            id: Joi.number().optional(),
            isVisible: Joi.boolean().optional(),
            isActived: Joi.boolean().optional(),
        });
        return schema;
    }

    static orderArticleDto() {
        const schema = Joi.object({
            quantity: Joi.number().required(),
            price: Joi.number().required(),
            productId: Joi.number().required(),
            orderId: Joi.number().required(),
            id: Joi.number().optional(),
        });
        return schema;
    }

    static  commentDto() {
        const schema = Joi.object({
            content: Joi.string().required(),
            date: Joi.string().required(),
            userId: Joi.number().required(),
            id: Joi.number().optional(),
            isVisible: Joi.boolean().optional(),
            isActived: Joi.boolean().optional(),
        });
        return schema;
    }

    static loginDto() {
        const schema = Joi.object({
            phone: Joi.number().required(),
            password: Joi.string().required(),
        });
        return schema;
    }

    static promotionDto() {
        const schema = Joi.object({
            beginDate:  Joi.string().required(),
            endDate:  Joi.string().required(),
            description:  Joi.string().required(),
            id:  Joi.number().optional(),
            isVisible:  Joi.number().optional(),
            isActived:  Joi.number().optional(),
        });

        return schema;
    }


    static promotionArticleDto() {
        const schema = Joi.object({
            newPrice: Joi.number().required(),
            oldPrice: Joi.number().required(),
            productId: Joi.number().required(),
            promotionId: Joi.number().required(),
            id: Joi.number().optional(),
        });
        return schema;
    }

    static providerDto() {
        const  schema = Joi.object({
            name:  Joi.string().required(),
            address:  Joi.string().required(),
            phone:  Joi.number().required(),
            type:  Joi.string().required(),
            id:  Joi.number().optional(),
            isVisible:  Joi.boolean().optional(),
            isActived:  Joi.boolean().optional(),
        });

        return schema;
    }

    static stockArticleDto() {
        const schema = Joi.object({
            quantity: Joi.number().required(),
            stockPrice: Joi.number().required(),
            productId: Joi.number().required(),
            stockId: Joi.number().required(),
            id: Joi.number().optional(),
        });
        return schema;
    }

    static stockDto() {
        const scheam = Joi.object({
            providerId: Joi.number().required(),
            id: Joi.number().optional(),
            isVisible:  Joi.boolean().optional(),
            isActived:  Joi.boolean().optional(),
        });
        return scheam;
    }
}