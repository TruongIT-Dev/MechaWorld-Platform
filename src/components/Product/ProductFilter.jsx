import { useState } from "react";
import { Select, Slider, Checkbox, Button } from "antd";

const { Option } = Select;

// Sample data structure for Gundam products
const products = [
    { id: 1, name: "RX-78-2 Gundam", grade: "Master Grade", price: 500, stock: true },
    { id: 2, name: "Wing Gundam Zero", grade: "High Grade", price: 300, stock: false },
    { id: 3, name: "Strike Freedom", grade: "Real Grade", price: 400, stock: true },
    { id: 4, name: "Unicorn Gundam", grade: "Perfect Grade", price: 1000, stock: true },
    { id: 5, name: "Barbatos Lupus", grade: "High Grade", price: 350, stock: false },
];

// Function to filter products
function filterProducts({ grade, priceRange, inStock }) {
    return products.filter(product => {
        const matchesGrade = grade ? product.grade === grade : true;
        const matchesPrice = priceRange
            ? product.price >= priceRange[0] && product.price <= priceRange[1]
            : true;
        const matchesStock = inStock !== undefined ? product.stock === inStock : true;

        return matchesGrade && matchesPrice && matchesStock;
    });
}

const ProductFilter = () => {
    const [grade, setGrade] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [inStock, setInStock] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState(products);

    const handleFilter = () => {
        const filters = {
            grade,
            priceRange,
            inStock,
        };
        setFilteredProducts(filterProducts(filters));
    };

    return (
        <div className="p-4 mr-2 max-w-lg mx-auto ">
            <h1 className="text-xl font-bold mb-4">Filter Gundam Products</h1>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Grade</label>
                <Select
                    className="w-full"
                    placeholder="Select Grade"
                    onChange={value => setGrade(value)}
                    allowClear
                >
                    <Option value="High Grade">High Grade</Option>
                    <Option value="Master Grade">Master Grade</Option>
                    <Option value="Real Grade">Real Grade</Option>
                    <Option value="Perfect Grade">Perfect Grade</Option>
                </Select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price Range</label>
                <Slider
                    range
                    min={0}
                    max={1000}
                    defaultValue={[0, 1000]}
                    onChange={value => setPriceRange(value)}
                />
                <div className="flex justify-between text-sm">
                    <span>$0</span>
                    <span>$1000</span>
                </div>
            </div>
            <div className="mb-4">
                <Checkbox
                    onChange={e => setInStock(e.target.checked)}
                >
                    In Stock Only
                </Checkbox>
            </div>
            <Button className="w-full" onClick={handleFilter}>
                Apply Filters
            </Button>

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Filtered Products</h2>
                <ul>
                    {filteredProducts.map(product => (
                        <li key={product.id} className="border-b py-2">
                            {product.name} - ${product.price} ({product.grade})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductFilter;
