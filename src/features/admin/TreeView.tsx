/* eslint-disable react/prop-types */
import { useState } from "react";
import { makeStyles } from "tss-react/mui";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { TreeView, TreeItem } from "@mui/lab";

const useStyles = makeStyles({
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	root: {
		flexGrow: 1,
		maxWidth: 400,
	},
});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function renderTree(nodes) {
	return (
		<TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name}>
			{Array.isArray(nodes.subcategories)
				? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
				  // @ts-ignore
				  nodes.subcategories.map((node) => renderTree(node))
				: null}
			{nodes.tags && nodes.tags.length > 0 ? (
				<TreeItem
					key={`${nodes.name}-tags`}
					nodeId={`${nodes.name}-tags`}
					label="Tags"
				>
					{/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore */}
					{nodes.tags.map((tag) => (
						<TreeItem
							key={`${nodes.name}-${tag}`}
							nodeId={`${nodes.name}-${tag}`}
							label={tag}
						/>
					))}
				</TreeItem>
			) : null}
		</TreeItem>
	);
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line react/prop-types
function CategoryTree({ data }) {
	// eslint-disable-next-line react/prop-types
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const classes = useStyles();
	const [expanded, setExpanded] = useState([]);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const handleToggle = (event, nodeIds) => {
		setExpanded(nodeIds);
	};

	return (
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		<div className={classes.root}>
			<TreeView
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
				expanded={expanded}
				onNodeToggle={handleToggle}
			>
				{/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore */}
				{/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore */}
				{data.map((category) => renderTree(category))}
			</TreeView>
		</div>
	);
}

export default CategoryTree;
