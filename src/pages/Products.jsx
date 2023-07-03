import CategoryCard from "../components/CategoryCard";
import categoryData from "../data/categoryData"
import "../assets/stylesheets/products.css"

export default function Products() {
  //this page is for showing the different categories
  const categoryCards = categoryData.map(card => {
    return <li key={card.title}><CategoryCard image={card.image} title= {card.title}/></li>
  })
  return (
    <>
      <div className="product-category-container">
          <ul>
            {categoryCards}
            <div className="filling-empty-space-childs" />
            <div className="filling-empty-space-childs" />
            <div className="filling-empty-space-childs" />
          </ul>
      </div>
    </>
  );
}
