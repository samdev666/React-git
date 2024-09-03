import React, { useState } from "react";
import moment from "moment";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Chip, MenuItem, Typography } from "@mui/material";
import { MetaData } from "@wizehub/common/models/baseEntities";
import {
  colors,
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import { Status } from "@wizehub/common/models/modules";
import { capitalizeLegend } from "@wizehub/common/utils/commonFunctions";
import {
  StyledActionItem,
  StyledActionListContainer,
  StyledArrowDropIcon,
  StyledCellContainer,
  StyledExpandableIcon,
  StyledInfo,
  StyledNoDataInfo,
  StyledNoDataInfoContainer,
  StyledPagesContainer,
  StyledPaginationContainer,
  StyledPaginationLimitContainer,
  StyledPaginationMainContainer,
  StyledPaginationShowContainer,
  StyledSelectPage,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from "./styles";
import messages from "../messages";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const formatStr = (str: string): string => str;
export const formatDate = (str: string): string =>
  str ? moment(str).format("DD MMM YYYY") : "";
export const formatStatus = (status: Status) =>
  status ? (
    <Chip
      label={capitalizeLegend(status)}
      sx={{
        backgroundColor:
          status === Status.active
            ? otherColour.successBg
            : otherColour.errorBg,
        borderRadius: "4px",
        padding: "4px 8px",
        color:
          status === Status.active
            ? otherColour.successDefault
            : otherColour.errorDefault,
      }}
    />
  ) : (
    "-"
  );

const paginationLimitOpts = [10, 20, 50];

export interface TableSpec {
  id: string;
  label?: string;
  minWidth?: string | number;

  format?(val: any): JSX.Element | string;

  getValue?(row: any): any;
  hasTotal?: boolean;
  totalValue?: string | number | JSX.Element;
}

export interface ActionSpec {
  id: string;
  component?: JSX.Element;
  render?: (row: any) => JSX.Element;
  onClick(row: any): void;
  renderAction?: (row: any) => void;
}

export interface TableProps {
  specs: TableSpec[];
  data: Record<string, any>[];
  metadata?: MetaData<any>;
  emptyMessage?: string;
  disableSorting?: string[];
  disableTableSorting?: boolean;
  actions?: ActionSpec[];
  actionLabel?: string;

  renderColumn?(column: string): boolean;

  updateFilters?(param: Partial<MetaData<any>>): void;

  getId?(param: Record<string, any>): any;

  fetchPage?(page?: number): void;
  updateLimit?(limit?: number): void;
  handleSort?: (id: string) => void;
  dragItem?: React.MutableRefObject<any>;
  dragOverItem?: React.MutableRefObject<any>;
  isExpandable?: boolean;
  expandRow?: (row: Record<string, any>) => JSX.Element;
  hasRowWithTotal?: boolean;
}

export const ActionMenu: React.FC<{
  actions: ActionSpec[];
  row: Record<string, any>;
}> = ({ actions, row }) => {
  const handleClick = (actionClick?: any) => {
    if (actionClick) {
      actionClick(row);
    }
  };
  return (
    <StyledActionListContainer>
      {actions
        .filter((action) =>
          action?.renderAction ? action?.renderAction(row) : true
        )
        .map((action) => (
          <StyledActionItem
            key={action.id}
            onClick={() => handleClick(action.onClick)}
          >
            {action.component}
            {action.render?.(row)}
          </StyledActionItem>
        ))}
    </StyledActionListContainer>
  );
};

const Table: React.FC<TableProps> = ({
  data,
  specs,
  metadata,
  disableSorting,
  actions,
  emptyMessage,
  disableTableSorting,
  actionLabel,
  updateFilters,
  renderColumn,
  getId,
  fetchPage,
  updateLimit,
  handleSort,
  expandRow,
  isExpandable,
  dragItem,
  dragOverItem,
  hasRowWithTotal,
}) => {
  const shouldRenderColumn = (column: string): boolean =>
    !renderColumn || renderColumn(column);
  const [expandedRow, setExpandedRow] = useState<any>({});

  const hasActions = () => actions && actions?.length > 0;

  const getRowId = (row: Record<string, any>) => (getId ? getId(row) : row.id);

  const arrowComponent = (metadata: MetaData<any>) => {
    if (metadata?.direction === "asc") {
      return (
        <ArrowDownwardIcon
          fontSize="medium"
          style={{ color: colors.grey100, fontSize: "18px" }}
        />
      );
    }
    return (
      <ArrowUpwardIcon
        fontSize="medium"
        style={{ color: colors.grey100, fontSize: "18px" }}
      />
    );
  };

  const titles = () => {
    const updatePagination = updateFilters || (() => undefined);

    const clickTitle = (spec: TableSpec) => {
      if (
        metadata &&
        !disableTableSorting &&
        !disableSorting?.includes?.(spec.id)
      ) {
        const toggleOrder = metadata.order === spec.id;
        const newDirection =
          toggleOrder && metadata.direction === "asc" ? "desc" : "asc";
        updatePagination({
          order: spec.id,
          direction: newDirection,
        });
      }
    };

    return specs
      .filter((spec) => shouldRenderColumn(spec.id))
      .map((spec) => {
        const canSort =
          !disableTableSorting && !disableSorting?.includes?.(spec.id);
        const showIcon = metadata && canSort && metadata?.order === spec.id;
        return (
          <StyledTableCell
            key={spec.label || `_id_${spec.id}`}
            onClick={() => clickTitle(spec)}
            style={{
              minWidth: spec?.minWidth || "auto",
              display: spec?.id === "draggable" && "none",
            }}
          >
            <StyledCellContainer
              style={{
                cursor: !disableSorting?.includes(spec?.id) && "pointer",
              }}
            >
              {spec.label || ""}
              {showIcon && arrowComponent(metadata)}
            </StyledCellContainer>
          </StyledTableCell>
        );
      })
      .concat(
        hasActions()
          ? [<StyledTableCell key="actions">{actionLabel}</StyledTableCell>]
          : []
      )
      .concat(
        isExpandable
          ? [<StyledTableCell key="actions">{actionLabel}</StyledTableCell>]
          : []
      );
  };

  const fields = () => {
    let immutableData = [...data];
    specs.forEach((spec) => {
      if (spec.getValue) {
        immutableData = immutableData.map((row: Record<string, any>) => ({
          ...row,
          [spec.id]: spec.getValue?.(row),
        }));
      }
    });
    Object.freeze(immutableData);

    const fieldData = immutableData?.map(
      (row: Record<string, any>, index?: number) => (
        <>
          <StyledTableRow
            key={getRowId(row)}
            draggable={!!row?.draggable}
            onDragEnd={() => handleSort(row.id)}
            onDragOver={(e) => e.preventDefault()}
          >
            {specs
              .filter((spec) => shouldRenderColumn(spec.id))
              .map((field) => {
                const formatter = (param: any) =>
                  field.format ? field.format(param) : formatStr(param);
                return (
                  <StyledTableCell
                    key={`${field.label}@${field.id}`}
                    style={{
                      minWidth: field?.minWidth || "auto",
                      wordBreak: "break-word",
                      display: field?.id === "draggable" && "none",
                      width: field?.id === "drag" && "70px",
                      whiteSpace: field.id === "name" ? "pre-wrap" : "normal", // for now keeping it for the name column only (because of this the white spaces were getting trimmed)
                    }}
                  >
                    {field.id === "sno" &&
                      formatter(
                        (metadata?.page - 1) * metadata?.limit + index + 1
                      )}
                    {formatter(row[field.id])}
                  </StyledTableCell>
                );
              })}
            {hasActions() && (
              <StyledTableCell key="actionButtons">
                <ActionMenu actions={actions} row={row} />
              </StyledTableCell>
            )}
            {isExpandable && (
              <StyledTableCell key="expandableButton">
                <StyledExpandableIcon
                  onClick={() =>
                    setExpandedRow((prev: any) => ({
                      ...prev,
                      [row.id]: !prev[row.id],
                    }))
                  }
                >
                  {expandedRow[row.id] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </StyledExpandableIcon>
              </StyledTableCell>
            )}
          </StyledTableRow>
          {isExpandable && expandedRow[row.id] && (
            <StyledTableRow
              key={`${getRowId(row)}-expanded`}
              style={{
                backgroundColor: greyScaleColour.grey60,
                borderTop: `1px solid ${greyScaleColour.grey80}`,
                borderBottom: `1px solid ${greyScaleColour.grey80}`,
              }}
            >
              <StyledTableCell
                colSpan={
                  specs.length +
                  (isExpandable ? 1 : 0) +
                  (hasActions() ? actions?.length : 0)
                }
                style={{ padding: "24px" }}
              >
                {expandRow(row)}
              </StyledTableCell>
            </StyledTableRow>
          )}
        </>
      )
    );
    return (
      <>
        {fieldData}
        {fieldData?.length && hasRowWithTotal ? (
          <StyledTableRow
            draggable={false}
            borderTop={`1px solid ${greyScaleColour.grey80}`}
          >
            {specs
              .filter((spec) => shouldRenderColumn(spec.id))
              .map((field) => {
                return (
                  <StyledTableCell
                    key={`${field.label}@${field.id}`}
                    style={{
                      minWidth: "auto",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {field?.hasTotal ? field?.totalValue || "" : ""}
                  </StyledTableCell>
                );
              })}
          </StyledTableRow>
        ) : (
          <></>
        )}
      </>
    );
  };

  const pagination = () => {
    const pageCount = Math.ceil(metadata?.total / metadata?.limit);
    const pages = [];

    pages.push(
      <ChevronLeftRoundedIcon
        style={{
          color:
            metadata?.page > 1
              ? greyScaleColour.secondaryMain
              : greyScaleColour.grey100,
          cursor: metadata?.page > 1 ? "pointer" : "inherit",
        }}
        onClick={() => {
          if (pageCount > 1 && metadata?.page > 1) {
            fetchPage(metadata?.page - 1);
          }
        }}
      />
    );

    pages.push(
      <ChevronRightRoundedIcon
        style={{
          color:
            pageCount !== metadata?.page
              ? greyScaleColour.secondaryMain
              : greyScaleColour.grey100,
          cursor: pageCount !== metadata?.page ? "pointer" : "inherit",
        }}
        onClick={() => {
          if (pageCount !== metadata?.page) {
            fetchPage(metadata?.page + 1);
          }
        }}
      />
    );

    return pages;
  };

  return (
    <StyledTableContainer>
      <StyledTable>
        <StyledTableHead>
          <StyledTableRow>{titles()}</StyledTableRow>
        </StyledTableHead>
        <StyledTableBody>{[fields()]}</StyledTableBody>
      </StyledTable>
      {data.length === 0 && (
        <StyledNoDataInfoContainer>
          <StyledNoDataInfo>
            {emptyMessage || messages?.general?.noData}
          </StyledNoDataInfo>
        </StyledNoDataInfoContainer>
      )}
      {data.length !== 0 && fetchPage && (
        <StyledPaginationContainer>
          <StyledPaginationMainContainer>
            <StyledPaginationLimitContainer>
              <StyledInfo variant="body1">
                {messages?.general?.showing}
              </StyledInfo>
              <StyledSelectPage
                IconComponent={StyledArrowDropIcon}
                value={metadata?.limit}
                onChange={(event: any) => {
                  if (updateLimit) {
                    updateLimit(event?.target?.value);
                  }
                }}
              >
                {paginationLimitOpts?.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </StyledSelectPage>
            </StyledPaginationLimitContainer>
            <StyledPaginationShowContainer>
              <Typography variant="body1">
                {(metadata?.page - 1) * metadata?.limit + 1}-
                {metadata?.limit * metadata?.page > metadata?.total
                  ? metadata?.total
                  : metadata?.limit * metadata?.page}{" "}
                of {metadata?.total}
              </Typography>
            </StyledPaginationShowContainer>
            <StyledPagesContainer>{pagination()}</StyledPagesContainer>
          </StyledPaginationMainContainer>
        </StyledPaginationContainer>
      )}
    </StyledTableContainer>
  );
};

export default React.memo(Table);
