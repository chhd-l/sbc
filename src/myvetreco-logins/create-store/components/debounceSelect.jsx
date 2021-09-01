import React, { forwardRef } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

function DebounceSelect({ fetchOptions, debounceTimeout = 800, defaultOptions=[], ...props },ref) {
    console.log(props)
    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const fetchRef = React.useRef(0);
    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
        <Select
            ref={ref}
            labelInValue
            size="large"
            showSearch
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            {...props}
        >
            {
                options.map(item=>(
                    <Option value={item.id} key={item.id}>{item.cityName}</Option>
                ))
            }
        </Select>
    );
} // Usage of DebounceSelect
export default forwardRef(DebounceSelect)