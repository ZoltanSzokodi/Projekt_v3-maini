import { useState, useEffect } from 'react';

import productslist from '../productslist';
import FilterForm from './FilterForm';
import FilterStatus from './FilterStatus';

export default function Filter() {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [saleOnly, setSaleOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);

    const oldKeyword = url.searchParams.get('keyword');
    if (oldKeyword) {
      setKeyword(oldKeyword);
    }

    const oldSaleOnly = url.searchParams.get('sale');
    if (oldSaleOnly === 'true') {
      setSaleOnly(true);
    }

    const oldCategory = url.searchParams.get('category');
    if (oldCategory) {
      setSelectedCategory(parseInt(oldCategory));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);

    url.searchParams.delete('keyword');

    if (keyword) {
      url.searchParams.set('keyword', keyword);
    }

    url.searchParams.delete('sale');
    if (saleOnly) {
      url.searchParams.set('sale', saleOnly);
    }

    url.searchParams.delete('category');

    if (selectedCategory) {
      url.searchParams.set('category', selectedCategory);
    }

    window.history.replaceState({}, '', url);
  }, [keyword, saleOnly, selectedCategory]);

  const filteredProducts = getFilteredProducts(
    productslist,
    keyword,
    selectedCategory,
    saleOnly
  );

  if (loading) {
    return null;
  }

  return (
    <div className="filter">
      <FilterForm
        keyword={keyword}
        setKeyword={setKeyword}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        saleOnly={saleOnly}
        setSaleOnly={setSaleOnly}
      />
      <FilterStatus count={filteredProducts.length} />
    </div>
  );
}

function getFilteredProducts(
  productslist,
  keyword,
  selectedCategory,
  saleOnly
) {
  const keywordRegExp = new RegExp(keyword, 'i');

  const noKeywordFilter = keyword.length < 2;
  const noCategoryFilter = selectedCategory === 0;
  const noSaleFilter = saleOnly === false;

  const filteredProducts = productslist
    .filter(({ name }) => noKeywordFilter || keywordRegExp.test(name))
    .filter(({ category }) => noCategoryFilter || category === selectedCategory)
    .filter(({ sale }) => noSaleFilter || sale);

  return filteredProducts;
}
