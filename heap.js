/** @license MIT License (c) copyright B Cavalier */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(define) {
define(function() {

	var ap, apSlice, apSplice, apSort;

	ap = Array.prototype;
	apSlice = ap.slice.call.bind(ap.slice);
	apSplice = ap.splice.call.bind(ap.splice);
	apSort = ap.sort.call.bind(ap.sort);

	return {
		add: add,
		remove: remove,
		merge: merge,
		indexOf: indexOf,
		find: find,
		fromArray: fromArray,
		from: from
	};

	function fromArray(comparator, list) {
		var heap = apSlice(list);
		apSort(heap, comparator);

		return heap;
	}

	function from(comparator /* items... */) {
		var heap = apSlice(arguments, 1);
		apSort(heap, comparator);

		return heap;
	}

	function indexOf(comparator, item, heap) {
		return find(heap, item, comparator,
			function(item, index) {
				return index;
			},
			function() {
				return -1;
			}
		);
	}

	function add(comparator, item, heap) {
		return find(heap, item, comparator,
			function(item, index) {
				return index;
			},
			function(item, index, heap) {
				apSplice(heap, index, 0, item);
				return index;
			}
		);
	}

	function remove(comparator, item, heap) {
		return find(heap, item, comparator,
			function(item, index, heap) {
				apSplice(heap, index, 1);
				return item;
			},
			function () {
				return -1;
			}
		);

	}

	function merge(comparator, heap1, heap2) {
		var item1, item2, merged, i1, i2, len1, len2;

		merged = [];

		i1 = 0;
		len1 = heap1.length;

		i2 = 0;
		len2 = heap2.length;

		while(i1 < len1 && i2 < len2) {
			item1 = heap1[i1];
			item2 = heap2[i2];
			if(comparator(item1, item2) <= 0) {
				merged.push(item1);
				++i1;
			} else {
				merged.push(item2);
				++i2;
			}
		}

		while(i1 < len1) {
			merged.push(heap1[i1]);
			++i1;
		}

		while(i2 < len2) {
			merged.push(heap2[i2]);
			++i2;
		}

		return merged;
	}

	function find(arr, item, comparator, found, notFound) {

		var min, max, mid, compare;

		if(!arr.length) {
			return notFound(item, 0, arr);
		}

		min = 0;
		max = arr.length - 1;
		mid = Math.floor((min + max) / 2);

		while(min < max) {
			compare = comparator(item, arr[mid]);
			if(compare < 0) {
				max = mid - 1;
			} else if(compare > 0) {
				min = mid + 1;
			} else {
				return found(item, mid, arr);
			}

			mid = Math.floor((min + max) / 2);
		}

		compare = comparator(item, arr[mid]);
		if(compare === 0) {
			return found(item, mid, arr);
		} else {
			return notFound(item, compare < 0 ? mid : mid+1, arr);
		}
	}

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
