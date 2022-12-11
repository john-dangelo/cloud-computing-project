import { Center } from '@mantine/core';
import React, { useEffect, useState } from 'react';

export const LastUpdated = (props: { data: unknown }) => {
  const { data } = props;
  const [date, setDate] = useState<Date>(new Date());
  useEffect(() => {
    if (data) {
      setDate(new Date());
    }
  }, [data]);
  return <Center>Last updated: {date.toLocaleString()}</Center>;
};
