import { useTableId } from '@teable-group/sdk/hooks';
import type { IViewInstance } from '@teable-group/sdk/model';
import { Button } from '@teable-group/ui-lib/shadcn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@teable-group/ui-lib/shadcn/ui/dropdown-menu';
import { Input } from '@teable-group/ui-lib/shadcn/ui/input';
import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { VIEW_ICON_MAP } from '../constant';
import { useDeleteView } from './useDeleteView';
interface IProps {
  view: IViewInstance;
  removable: boolean;
  isActive: boolean;
}

export const ViewListItem: React.FC<IProps> = ({ view, removable, isActive }) => {
  const [isEditing, setIsEditing] = useState(false);
  const tableId = useTableId();
  const router = useRouter();
  const baseId = router.query.baseId as string;
  const deleteView = useDeleteView(view.id);

  const ViewButton = () => {
    const ViewIcon = VIEW_ICON_MAP[view.type];

    return (
      <Button
        className={classnames('w-full px-1', { 'bg-secondary': isActive })}
        variant="ghost"
        size="xs"
        asChild
      >
        <Link
          href={{
            pathname: '/base/[baseId]/[nodeId]/[viewId]',
            query: { baseId, nodeId: tableId, viewId: view.id },
          }}
          title={view.name}
          onDoubleClick={() => {
            setIsEditing(true);
          }}
          shallow={true}
          onClick={(e) => {
            if (isActive) {
              e.preventDefault();
            }
          }}
        >
          <ViewIcon className="h-4 w-4 shrink-0" />
          <p className="shrink-1 truncate">{view.name}</p>
        </Link>
      </Button>
    );
  };
  return (
    <div className={'relative flex min-w-[100px] max-w-[33%] items-center justify-start'}>
      {!isEditing && (
        <>
          <DropdownMenu>
            {isActive ? (
              <DropdownMenuTrigger className="w-full">
                <ViewButton />
              </DropdownMenuTrigger>
            ) : (
              <ViewButton />
            )}
            <DropdownMenuContent side="bottom" align="start">
              <DropdownMenuItem onSelect={() => setIsEditing(true)}>Rename view</DropdownMenuItem>
              <DropdownMenuItem>Duplicate view</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!removable}
                onSelect={(e) => {
                  e.preventDefault();
                  deleteView();
                }}
              >
                Delete view
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      {isEditing && (
        <Input
          type="text"
          placeholder="name"
          defaultValue={view.name}
          className="h-6 min-w-[150px] cursor-text py-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onBlur={(e) => {
            if (e.target.value && e.target.value !== view.name) {
              view.updateName(e.target.value);
            }
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (e.currentTarget.value && e.currentTarget.value !== view.name) {
                view.updateName(e.currentTarget.value);
              }
              setIsEditing(false);
            }
          }}
        />
      )}
    </div>
  );
};
