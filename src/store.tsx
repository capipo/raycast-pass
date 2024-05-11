import { ActionPanel, Action, List, Icon } from '@raycast/api';
import { relative } from 'path';
import { useEffect, useState } from 'react';
import { listFiles } from './gpg';
import Content from './content';

export default function Store({ storepath }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const files = await listFiles(storepath);
        setRows(files);
      } catch (error) {
        console.error('Failed to fetch file list:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFiles();
  }, [storepath]);

  const calcName = (filepath) => relative(storepath, filepath).replace('.gpg', '');

  return (
    <List isLoading={isLoading}>
      {rows.map((filepath) => (
        <List.Item
          key={filepath}
          icon={Icon.Lock}
          title={calcName(filepath)}
          actions={
            <ActionPanel>
              <Action.Push title={'Show Password Content'} target={<Content path={filepath} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
