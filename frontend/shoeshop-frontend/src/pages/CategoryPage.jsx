import { Link } from 'react-router-dom';

const CategoryPage = () => {
  const categories = [
    {
      name: 'Men',
      path: '/shoes?category=men',
      image: 'https://www.newbalance.com/dw/image/v2/AAGI_PRD/on/demandware.static/-/Library-Sites-NBUS-NBCA/default/dw221e5ac3/images/page-designer/2025/April/NB2370_Comp_S1_Desktop_Single.jpg',
    },
    {
      name: 'Women',
      path: '/shoes?category=women',
      image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/687619/87/mod03/fnd/JPN/fmt/png/%E3%82%A6%E3%82%A3%E3%83%A1%E3%83%B3%E3%82%BA-ESS-%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88-%E5%8D%8A%E8%A2%96-T%E3%82%B7%E3%83%A3%E3%83%84',
    },
    { 
      name: 'Kids', 
      path: '/shoes?category=kids', 
      image: 'https://www.newbalance.com/dw/image/v2/AAGI_PRD/on/demandware.static/-/Library-Sites-NBUS-NBCA/default/dwc0ef8900/images/page-designer/2025/February/NB-2896_Comp_J_Desktop.jpg' 
    },
    { 
      name: 'Brands',
      path: '/shoes', 
      image: 'https://plus.unsplash.com/premium_photo-1682435561654-20d84cef00eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hvZXN8ZW58MHx8MHx8fDA%3D' 
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-[230px] w-full ">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Add by Category</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            to={category.path}
            key={category.name}
            className="group block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-60 bg-gray-100">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => (e.target.src = '/default-shoe.jpg')}
              />
              {/* Removed black overlay */}
              <div className="absolute inset-0 transition-all duration-300" />
            </div>
            
            <div className="p-6 bg-white">
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {category.name}
              </h3>
              <p className="mt-2 text-gray-600 group-hover:text-gray-800 transition-colors">
                Shop now →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;